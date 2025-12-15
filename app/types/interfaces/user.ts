export interface User {
  id: string | undefined
  name: string | undefined
  email: string | undefined
  type: string | undefined
}

// Usado para criação e edição
export interface UserForm {
  id?: string | undefined
  name: string | undefined
  email: string | undefined
  password?: string | undefined
  type?: string | undefined
}