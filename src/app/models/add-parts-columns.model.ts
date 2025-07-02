export class AddPartsColumnsModel {
  columns: any[];

  constructor() {
    this.columns = [
      {
        label: 'Name',
        property: 'name',
        type: 'string',
        cellClass: 'display-column'
      },
      {
        label: 'Part Number',
        property: 'partNumber',
        cellClass: 'display-column'
      },
      {
        label: 'SKU',
        property: 'skuNumber',
        cellClass: 'display-column'
      }
    ];
  }
}
