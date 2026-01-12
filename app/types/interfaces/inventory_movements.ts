import type { MovementType } from "../enums/movement_type"
import type { Product } from "./product";

export interface InventoryMovement {
    id: string;
    product_id: string;
    product?: Product;
    type: MovementType;
    quantity: number;
    date_movement: string;
    observation: string | undefined;
}

export interface InventoryMovementForm {
    id?: string,
    product_id?: string,
    type?: MovementType,
    quantity?: number,
    date_movement?: string,
    observation?: string,
}