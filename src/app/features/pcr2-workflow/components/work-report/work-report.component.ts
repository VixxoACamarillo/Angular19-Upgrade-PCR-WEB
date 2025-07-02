import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

// Models
import { PartLocation } from '../../../../models/parts-location.model';
import { WorkReportModel } from '../../../../models/work-report.model';

// Services
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { LocalStorageKeys } from '../../../../shared/constants/local-storage-keys';

@Component({
  selector: 'app-work-report',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './work-report.component.html',
  styleUrls: ['./work-report.component.scss']
})
export class WorkReportComponent implements OnInit {
  public loader: boolean = false;
  public reportedIssue!: string;
  public proactiveActionList: WorkReportModel[] = [];
  public takenActionList: WorkReportModel[] = [];
  public isActionSelected = false;
  public selectedItem: any;
  public partData: PartLocation[] = [];
  private serviceRequestNumber!: string;
  private assetId!: string;
  private disableActionTakenItems!: boolean;
  private disableProactiveItems!: boolean;

  constructor(
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.serviceRequestNumber = this.route.snapshot.params['serviceRequestNumber'];
    this.assetId = this.route.snapshot.params['assetId'];
    this.bindPartActionStorageDatatoList();
  }

  bindPartActionStorageDatatoList() {
    let wholePartData: PartLocation[];

    const selectedPartsJson = this.localStorageService.readLocalStorage(
      this.serviceRequestNumber +
        '-' +
        this.assetId +
        '-' +
        LocalStorageKeys.SelectedParts
    );

    let selectedParts = selectedPartsJson ? JSON.parse(selectedPartsJson) : [];

    const wholePartDataJson = this.localStorageService.readLocalStorage(
      this.serviceRequestNumber +
        '-' +
        this.assetId +
        '-' +
        LocalStorageKeys.ApiResponse
    );

    wholePartData = wholePartDataJson ? JSON.parse(wholePartDataJson) : [];

    if (wholePartData != null) {
      let selectedIds = selectedParts.map((t: any) => t.id);
      this.partData = wholePartData.filter(x => selectedIds.includes(x.partId));
    }

    for (let i = 0; i < this.partData.length; i++) {
      let _proActiveActionSelection: boolean;
      let _actionTakenSelection: boolean;
      let _disableActionTakenselection;
      let _disableProactiveActionTakenSelection;

      if (this.partData[i].isProactiveFix == true) {
        _proActiveActionSelection = true;
        _disableActionTakenselection = true;
      } else {
        _proActiveActionSelection = false;
      }

      if (this.partData[i].isReportedFix == true) {
        _actionTakenSelection = true;
        _disableProactiveActionTakenSelection = true;
      } else {
        _actionTakenSelection = false;
      }

      let proactiveAction: WorkReportModel = {
        copyId: this.partData[i].copyId || 0,
        partId: this.partData[i].partId,
        partAction:
          this.partData[i]?.action?.actionName +
          ' - ' +
          this.partData[i].partName,
        isSelected: _proActiveActionSelection,
        isProactive: true,
        disableActionItems: _disableActionTakenselection || false,
        disableProactiveItems: _disableProactiveActionTakenSelection || false
      };

      let actionTaken: WorkReportModel = {
        copyId: this.partData[i].copyId || 0,
        partId: this.partData[i].partId,
        partAction:
          this.partData[i]?.action?.actionName +
          ' - ' +
          this.partData[i].partName,
        isSelected: _actionTakenSelection,
        isProactive: false,
        disableActionItems: _disableActionTakenselection || false,
        disableProactiveItems: _disableProactiveActionTakenSelection || false
      };

      this.proactiveActionList.push(proactiveAction);
      this.takenActionList.push(actionTaken);
    }

    this.reportedIssue =
      this.localStorageService.readLocalStorage(
        this.serviceRequestNumber +
          '-' +
          this.assetId +
          '-' +
          LocalStorageKeys.ServiceRequestIssue
      ) || '';
    this.loader = true;
  }

  onClick(selectedWorkReportItem: WorkReportModel) {
    this.selectedItem = selectedWorkReportItem;
    if (this.selectedItem.isProactive) {
      let filterPartsbyPartId = this.proactiveActionList.filter(
        x =>
          x.partId == this.selectedItem.partId &&
          x.copyId == this.selectedItem.copyId
      );
      if (filterPartsbyPartId.length > 0) {
        let selectedProactiveItem = this.proactiveActionList.find(
          x =>
            x.copyId == this.selectedItem.copyId &&
            x.partId == this.selectedItem.partId
        );
        let actionTakenItem = this.takenActionList.find(
          x =>
            x.copyId == this.selectedItem.copyId &&
            x.partId == this.selectedItem.partId
        );
        if (!actionTakenItem?.isSelected) {
          selectedProactiveItem!.isSelected = !this.selectedItem.isSelected;
          actionTakenItem!.disableActionItems = !actionTakenItem!.disableActionItems;
        } else {
          if ((actionTakenItem.disableActionItems = true)) {
            actionTakenItem.disableActionItems = false;
          }
        }
      } else {
        let selectedProactiveItem = this.proactiveActionList.find(
          x => x.partAction == this.selectedItem.partAction
        );
        let actionTakenItem = this.takenActionList.find(
          x => x.partAction == selectedProactiveItem?.partAction
        );
        if (!actionTakenItem?.isSelected) {
          selectedProactiveItem!.isSelected = !this.selectedItem.isSelected;
          actionTakenItem!.disableActionItems = !actionTakenItem?.disableActionItems;
        } else {
          if ((actionTakenItem.disableActionItems = true)) {
            actionTakenItem.disableActionItems = false;
          }
        }
      }
    } else {
      let filterPartsbyPartId = this.takenActionList.filter(
        x => x.partId == this.selectedItem.partId
      );
      if (filterPartsbyPartId.length > 0) {
        let selectedActionTakenItem = this.takenActionList.find(
          x =>
            x.copyId == this.selectedItem.copyId &&
            x.partId == this.selectedItem.partId
        );
        let proactiveActionItem = this.proactiveActionList.find(
          x =>
            x.copyId == this.selectedItem.copyId &&
            x.partId == this.selectedItem.partId
        );
        if (!proactiveActionItem!.isSelected) {
          selectedActionTakenItem!.isSelected = !this.selectedItem.isSelected;
          proactiveActionItem!.disableProactiveItems = !proactiveActionItem!.disableProactiveItems;
        } else {
          if (proactiveActionItem!.disableProactiveItems == true) {
            proactiveActionItem!.disableProactiveItems = false;
          }
        }
      } else {
        let selectedActionTakenItem = this.takenActionList.find(
          x => x.partAction == this.selectedItem.partAction
        );
        let proactiveActionItem = this.proactiveActionList.find(
          x => x.partAction == selectedActionTakenItem!.partAction
        );
        if (!proactiveActionItem!.isSelected) {
          selectedActionTakenItem!.isSelected = !this.selectedItem.isSelected;
          proactiveActionItem!.disableProactiveItems = !proactiveActionItem!.disableProactiveItems;
        } else {
          if (proactiveActionItem!.disableProactiveItems == true) {
            proactiveActionItem!.disableProactiveItems = false;
          }
        }
      }
    }
    this.storeSelectedDataInStorage();
  }

  storeSelectedDataInStorage(): void {
    let selectedProactiveItemValue;
    let selectedActionTakenItemValue;
    let apiresponsePartData: any[] = this.partData.filter(
      x => x.partId == this.selectedItem.partId
    );
    let responsedata;
    let indexOfPartItem;

    if (apiresponsePartData.length > 1) {
      responsedata = this.partData.find(
        x =>
          x.copyId == this.selectedItem.copyId &&
          x.partId == this.selectedItem.partId
      );
      selectedProactiveItemValue = this.proactiveActionList.find(
        x =>
          x.copyId == this.selectedItem.copyId &&
          x.partId == this.selectedItem.partId
      );
      selectedActionTakenItemValue = this.takenActionList.find(
        x =>
          x.copyId == this.selectedItem.copyId &&
          x.partId == this.selectedItem.partId
      );
      indexOfPartItem = this.partData.findIndex(
        x =>
          x.copyId == this.selectedItem.copyId &&
          x.partId == this.selectedItem.partId
      );
    } else {
      indexOfPartItem = this.partData.findIndex(
        o => o.partId === this.selectedItem.partId
      );
      responsedata = this.partData.find(
        x => x.partId == this.selectedItem.partId
      );
      selectedProactiveItemValue = this.proactiveActionList.find(
        x => x.partId == this.selectedItem.partId
      );
      selectedActionTakenItemValue = this.takenActionList.find(
        x => x.partId == this.selectedItem.partId
      );
    }

    responsedata!.isProactiveFix = selectedProactiveItemValue?.isSelected;
    responsedata!.isReportedFix = selectedActionTakenItemValue?.isSelected;

    if (indexOfPartItem > -1) {
      this.partData[indexOfPartItem] = responsedata!;
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

  getSelectedListToBindList() {
    const selectedDataJson = this.localStorageService.readLocalStorage(
      this.serviceRequestNumber +
        '-' +
        this.assetId +
        '-' +
        LocalStorageKeys.ApiResponse
    );
    let selectedData = selectedDataJson ? JSON.parse(selectedDataJson) : [];
  }

  onActionDeselect() {
    this.isActionSelected = false;
  }
}
