export interface Auth {
  nickname: string
  password: string
}

export interface AuthWithToken {
  _id?: string
  token: string
  nickname: string
  role: Role
}

/* export interface Permission {
  _id: string
  name: string
  description?: string
  actions: {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
  }
} */

export interface Role {
  _id: string
  name: string
  description?: string
  permissions: string[]
  isActive: boolean
}

export interface User {
  _id: string
  nickname: string
  email?: string
  password: string
  role: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  nameRole?: string
}
