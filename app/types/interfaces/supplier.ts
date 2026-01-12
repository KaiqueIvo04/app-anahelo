export interface Supplier {
    id: string
    name: string
    cnpj: string | undefined
    phone: string | undefined
    email: string | undefined
    address: string | undefined
    createdAt: string
    updatedAt: string
}

export interface SupplierForm {
    id?: string
    name?: string
    cnpj?: string | undefined
    phone?: string | undefined
    email?: string | undefined
    address?: string | undefined
}