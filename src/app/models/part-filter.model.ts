interface PartObject {
  [propName: string]: string;
}

export class PartFilterModel {
  label!: string;
  queryParam!: string;

  constructor(label: string, queryParam: string) {
    this.label = label;
    this.queryParam = queryParam;
  }
}
