import { ObjectId, Types } from 'mongoose'

export interface Sale {
  _id?: Types.ObjectId | string
  user?: Types.ObjectId | string
  cliente: Types.ObjectId | string
  estado: "PENDIENTE" | "COMPLETADA" | "CANCELADA"
  nameCliente?: string
  total: number
  createdAt?: string
  itemsSale: ItemSale[]
}



export interface ItemSale {
  _id?: Types.ObjectId | string
  idVenta?: Types.ObjectId | string
  idProducto: Types.ObjectId | string
  cantidad: number
  total: number
  precio: number
  name?: string
}

export interface ExtendItemSale extends ItemSale {
  descripcion?: string
  NameCategoria?: string
  precioUnitario?: number
  precioDescuento?: number
}