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

export interface Sale {
  id: string;
  items: SaleItemForm[];
  date_sale: string;
  total_value: number;
  payment_method: PaymentMethod;
  name_client: string;
  discount?: number;
  createdAt: string
  updatedAt: string
}
