export interface User {
  id: string
  name: string
  email: string
  type: string
  createdAt: string
  updatedAt: string
}

// Usado para criação e edição
export interface UserForm {
  id?: string
  name?: string
  email?: string
  password?: string
  type?: string
}