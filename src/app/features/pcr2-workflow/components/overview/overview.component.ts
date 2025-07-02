import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Models
import { PartLocation } from '../../../../models/parts-location.model';
import { Overview, Part } from '../../../../models/overview.model';

// Services
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { LocalStorageKeys } from '../../../../shared/constants/local-storage-keys';

// External libraries
import * as _ from 'lodash';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Output() submission = new EventEmitter<Part>();

  public overviewModel: Overview[] = [];
  public partData!: PartLocation[];
  private serviceRequestNumber!: string;
  private assetId!: string;

  constructor(
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.serviceRequestNumber = this.route.snapshot.params['serviceRequestNumber'];
    this.assetId = this.route.snapshot.params['assetId'];

    const partDataJson = this.localStorageService.readLocalStorage(
      this.serviceRequestNumber +
        '-' +
        this.assetId +
        '-' +
        LocalStorageKeys.ApiResponse
    );

    this.partData = partDataJson ? JSON.parse(partDataJson) : [];

    if (this.partData && this.partData.length > 0) {
      let actionGroupBy = this.findDistinctAction(this.partData);
      actionGroupBy.forEach((action: any) => {
        let overview = {
          actionName: action.actionName,
          parts: this.findPartsByAction(this.partData, action.actionName)
        };
        this.overviewModel.push(overview);
      });
    }
  }

  findDistinctAction(partData: PartLocation[]) {
    return partData
      .filter(
        (v: any, i: any, a: any) =>
          a.findIndex(
            (v2: any) => v2.action.actionName === v.action.actionName
          ) === i
      )
      .map((ele: any) => ele.action);
  }

  findPartsByAction(partData: PartLocation[], action: string): Part[] {
    let parts: Part[] = [];
    partData.forEach((element: any) => {
      if (element.action.actionName === action) {
        let part = {
          name: element.partName,
          number: element.partNumber,
          sku: element.skuNumber,
          isProactiveFix: element.isProactiveFix,
          isReportedFix: element.isReportedFix,
          cause: element.cause,
          copyId: element.copyId,
          overviewPartQuantity:
            action &&
            action.toLowerCase() == 'replaced' &&
            element.overviewPartQuantity >= 0
              ? element.overviewPartQuantity
              : 1
        };
        parts.push(part);
      }
    });
    parts = _.sortBy(parts, 'name');
    return parts;
  }

  onKeyDown(part: Part) {
    this.updateLocalStorage(part);
    this.submission.emit(part);
  }

  onKeyPress(event: any) {
    const key = String.fromCharCode(event.keyCode);
    if (key == '.') {
      event.preventDefault();
    }
  }

  updateLocalStorage(updatedPart: Part) {
    const index = this.partData.findIndex(
      (part: PartLocation) =>
        part?.action?.actionName.toLowerCase() === 'replaced' &&
        part.partNumber == updatedPart.number &&
        part.copyId == updatedPart.copyId
    );

    if (index > -1) {
      this.partData[index].overviewPartQuantity = updatedPart.overviewPartQuantity
        ? updatedPart.overviewPartQuantity
        : 0;
    }

    this.localStorageService.writeLocalStorage(
      this.serviceRequestNumber +
        '-' +
        this.assetId +
        '-' +
        LocalStorageKeys.ApiResponse,
      JSON.stringify(this.partData)
    );
  }
}
