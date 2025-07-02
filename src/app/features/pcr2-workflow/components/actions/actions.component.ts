import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CauseComponent } from '../cause/cause.component';

// Models
import { Action, Cause, CauseResponse } from '../../../../models/parts-location.model';

// Services
import { CauseService } from '../../../../services/cause.service';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [
    CommonModule,
    CauseComponent
  ],
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  @Input() actionData!: Action[];
  @Input() selectedPartId!: number;
  @Input() selectedAction!: Action;
  @Input() selectedCause!: Cause;
  @Input() causeData!: CauseResponse;
  @Output() selectedCauseData = new EventEmitter<any>();

  public isDataLoading = false;
  public isActionSelected = false;
  public selectedActionName!: string;
  public selectedPartIds: number[] = [];
  public loader: boolean = false;

  constructor(private causeService: CauseService) {}

  ngOnInit() {
    if (
      this.selectedAction &&
      this.selectedAction.actionName &&
      this.selectedAction.actionName.length > 1
    ) {
      this.selectedActionName = this.selectedAction.actionName;
      this.isActionSelected = true;
    }
    if (!this.causeData) {
      this.getCauseByPartId();
    }
  }

  onActionClick(selectedActionItem: Action) {
    if (this.selectedCause && this.selectedCause.causeId) {
      this.selectedCause = new Cause();
    }
    this.selectedActionName = selectedActionItem.actionName;
    this.isActionSelected = true;
    this.selectedAction = selectedActionItem;
    let actionData = {
      selectedCause: this.selectedCause,
      selectedAction: selectedActionItem
    };
    this.selectedCauseData.emit(actionData);
  }

  seletedPartCauseAction(selectedCause: Cause, selectedAction: Action) {
    let childActionCausedata = {
      selectedCause: selectedCause,
      selectedAction: selectedAction
    };
    this.selectedCauseData.emit(childActionCausedata);
  }

  onActionDeselect() {
    this.isActionSelected = false;
    this.selectedCause = new Cause();
    let actionData = {
      selectedCause: new Cause(),
      selectedAction: new Action()
    };
    this.selectedCauseData.emit(actionData);
  }

  getCauseByPartId() {
    this.loader = true;
    this.causeService
      .getCauseByPartId(this.selectedPartId)
      .subscribe((response: CauseResponse) => {
        this.loader = false;
        this.causeData = response;
      });
  }
}
