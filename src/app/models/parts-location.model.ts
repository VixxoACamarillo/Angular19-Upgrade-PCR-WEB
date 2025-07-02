export class PartInformation {
  partUiPathId!: number;
  partUiPathName!: string;
  partLocationId!: number;
  level!: number;
  id!: number;
  partid!: number;
  parentId!: number;
  partUiPath!: string;
  isSelected?: boolean;
  isAreaPathAlreadySelected?: boolean;
  isAreaPathLevelPartialSelect?: boolean;
}

export class Action {
  actionId!: number;
  actionName!: string;
}

export class Cause {
  causeId!: number;
  causeName!: string;
}

export class PartLocation {
  partId!: number;
  pcrLocationCopyCount?: number;
  showCopyIcon?: boolean;
  partName!: string;
  partNumber!: string;
  skuNumber?: string;
  pcrLocationPaths?: PartInformation[];
  pathFormed?: number[];
  action?: Action;
  copyId?: number;
  levelCount?: number;
  quantity?: number;
  isProactiveFix?: boolean;
  isReportedFix?: boolean;
  overviewPartQuantity?: number;
  cause?: Cause;
  isEdit?: boolean;
  causeData?: CauseResponse[];
  partLocationId?: number;
}

export class CauseResponse {
  partId!: number;
  actionName!: string;
  pcrPartCauses!: {
    causeDescription: string;
    causeId: number;
    causeName: string;
    parentCauseName: string;
    sbuxId: number;
  };
}

export class PartLocationLevelDataModel {
  partId!: number;
  copyId!: number;
  levelOne!: PartInformation[];
  levelTwo!: PartInformation[];
  levelThree!: PartInformation[];
  levelFour!: PartInformation[];
  levelFive!: PartInformation[];
  levelSix!: PartInformation[];
}

export class PartLocationInterface {
  partId!: number;
  copyId!: number;
  levelInfo!: PartInformation[];
}
