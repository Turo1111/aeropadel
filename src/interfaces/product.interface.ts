import { ObjectId, Types } from 'mongoose'

export interface Product {
  _id: Types.ObjectId
  name: string
  stock: number
  codigoBarra?: String
  precioCompra?: number
  precioUnitario: number
  categoria: ObjectId | string
  marca: ObjectId | string
  proveedor: ObjectId | string
  NameProveedor?: string,
  NameMarca?: string,
  NameCategoria?: string
  path?: string
}

export interface Categorie {
  name: string
}

export interface Brand {
  name: string
}

export interface Provider {
  name: string
}
