import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelBarModule, PanelBarExpandMode } from '@progress/kendo-angular-layout';

// Models
import { Cause } from '../../../../models/parts-location.model';

@Component({
  selector: 'app-cause',
  standalone: true,
  imports: [
    CommonModule,
    PanelBarModule
  ],
  templateUrl: './cause.component.html',
  styleUrls: ['./cause.component.scss']
})
export class CauseComponent implements OnInit {
  @Input() causeData: any;
  @Input() actionId!: number;
  @Input() selectedCause!: Cause;
  @Output() selectedCauseData = new EventEmitter<any>();

  public expandMode: any = 'single';

  public selectedCauseName!: string;
  public causeByAction: any;
  public groupByParentCause: any;
  public isCauseSelected = false;
  public selectedCauseId!: number;
  public expandedItem: any;

  constructor() {}

  ngOnInit() {
    if (this.selectedCause && this.selectedCause.causeId) {
      this.selectedCauseName = this.selectedCause.causeName;
      this.isCauseSelected = true;
    } else {
      this.causeUpdate();
    }
  }

  getCauseByActionId(actionId: number) {
    if (this.causeData) {
      this.causeByAction = this.causeData.pcrActionCauses.filter(
        (cause: any) => actionId == cause.actionId
      );
      let pcrPartCauses = this.causeByAction[0].pcrPartCauses;
      let causes = Object.values(
        this.groupItemBy(pcrPartCauses, 'parentCauseName')
      );
      this.groupByParentCause = [];
      causes.forEach(element => {
        this.groupByParentCause.push({
          parentCauseName: (element as any)[0].parentCauseName,
          childCause: element
        });
      });
    }
  }

  groupItemBy(array: any, property: any) {
    var hash: any = {},
      props = property.split('.');
    for (var i = 0; i < array.length; i++) {
      var key = props.reduce(function(acc: any, prop: any) {
        return acc && acc[prop];
      }, array[i]);
      if (!hash[key]) hash[key] = [];
      hash[key].push(array[i]);
    }
    return hash;
  }

  onCauseClick(selectedActionItem: any) {
    this.selectedCauseName = selectedActionItem.causeName;
    this.selectedCause = selectedActionItem.causeName;
    this.selectedCauseId = selectedActionItem.causeId;
    let cause = {
      causeId: selectedActionItem.causeId,
      causeName: selectedActionItem.causeName
    };
    this.selectedCauseData.emit(cause);
    this.isCauseSelected = true;
  }

  onCauseDeselect() {
    this.isCauseSelected = false;
    this.selectedCause = new Cause();
    this.causeUpdate();
    this.selectedCauseData.emit(this.selectedCause);
  }

  causeUpdate() {
    if (!this.isCauseSelected) {
      if (this.actionId) {
        this.getCauseByActionId(this.actionId);
      }
    }
  }

  public onStateChange(e: any) {
    this.expandedItem = e.items?.filter((item: any) => item.selected)[0]?.title;
  }
}
