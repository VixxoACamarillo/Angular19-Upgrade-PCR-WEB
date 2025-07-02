export class Overview {
  actionName!: string;
  parts!: Part[];
}

export class Part {
  name!: string;
  number!: string;
  sku!: string;
  isProactiveFix!: boolean;
  isReportedFix!: boolean;
  overviewPartQuantity!: number;
  cause!: string;
  copyId!: number;
}
