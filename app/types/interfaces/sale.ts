// types/interfaces/sale.ts
import type { PaymentMethod } from "../enums/payment_method";

export interface SaleItemForm {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface SaleForm {
  name_client?: string;
  payment_method: PaymentMethod | undefined;
  discount?: number;
  items: SaleItemForm[];
}
