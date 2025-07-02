export interface PcrData {
  partId: number;
  actionId: number;
  causeId: number;
  partLocationId: number;
  serviceRequestNumber: string;
  isProactiveFix: boolean;
  isReportedFix: boolean;
  overviewPartQuantity: number;
}

export class SavePcrData {
  pcrData!: PcrDto[];
  serviceRequestNumber!: string;
}

export class PcrDto {
  partId!: number;
  actionId!: number;
  causeId!: number;
  partLocationId!: number;
  resolutionType?: string;
  partQuantity!: number;
}
