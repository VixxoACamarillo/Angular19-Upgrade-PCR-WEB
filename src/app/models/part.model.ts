export class PartModel {
  id!: number;
  number!: string;
  name!: string;
  description!: string;
  isActionProduct!: boolean;
  isActive!: boolean;
  isTruckStock!: boolean;
  equipmentTypeId!: number;
  equipmentType!: string;
  materialCostMinimum!: number;
  materialCostMaximum!: number;
  partCategoryId!: number;
  partCategory!: string;
  productLineId!: string;
  productLine!: string;
  unitOfMeasure!: string;
  makeId!: number;
  warrantyTag?: number;
  isTpdPartUnderWarranty?: boolean;
  isReturnTagRequired?: boolean;
  warrantyTagErrorState?: boolean;
  sku?: string[];
  keywords?: string[];
  make!: string;
  legacyId!: string;
  quantity?: number;
  rate?: number;
  assetId?: number;
  actionId: any;
  actionName!: string;
  ormbPriceOverrideNote!: string;
  ormbCalculatedUnitPrice: any;
  lineItemId?: number;
  preTaxTotal!: number;
  isExpense!: boolean;
  isPriceJustified!: boolean;
  isDelete?: boolean;
  associatedAssetId?: number;
  isPartSelected!: boolean;
  isSelected?: boolean; // <-- Added for UI selection state
  partNumber!: string;
  skuNumber!: string[];
}

export class ProductListModel {
  legacyId!: string;
  productId!: number;
}

export const warrantyTagMinLength = 4;
