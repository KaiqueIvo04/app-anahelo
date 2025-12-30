export interface User {
  id: string
  name: string
  email: string
  type: string
  created_at: string
  updated_at: string
}

// Usado para criação e edição
export interface UserForm {
  id?: string
  name?: string
  email?: string
  password?: string
  type?: string
}