export interface Product {
    id: string
    image_base64: string
    name: string
    description: string
    category: string
    supplier_id: string | undefined
    inventory_quantity: number
    cost: number
    price: number
    created_at: string
    updated_at: string
}

export interface ProductForm {
    id?: string
    image_base64?: string
    name?: string
    description?: string
    category?: string
    supplier_id?: string
    inventory_quantity?: number
    cost?: number
    price?: number
}