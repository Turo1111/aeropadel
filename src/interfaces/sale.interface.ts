import { ObjectId, Types } from 'mongoose'

export interface Sale {
  _id: Types.ObjectId
  user: Types.ObjectId
  cliente: Types.ObjectId
  estado: EstadoVenta
  nameCliente: string
  total: number
  createdAt: string
  itemsSale: ItemSale[]
}

export enum EstadoVenta {
  PENDIENTE = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA', 
  CANCELADA = 'CANCELADA'
}


export interface ItemSale {
  _id?: Types.ObjectId
  idVenta: Types.ObjectId
  idProducto: Types.ObjectId
  cantidad: number
  total: number
  precio: number
  name?: string
}
