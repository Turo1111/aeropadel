"use client"

import type React from "react"

import { useEffect, useState } from "react"
import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { useFormik } from 'formik'
import { Product } from "@/interfaces/product.interface"
import Input from '../Input'
import InputSelectAdd from "../InputSelectAdd"
import { setAlert } from "@/redux/alertSlice"
import { useAppDispatch } from "@/redux/hook"
import { setLoading } from "@/redux/loadingSlice"
import apiClient from "@/utils/client"
import { io } from 'socket.io-client';

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 100;
`

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
`

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f1f5f9;
  }
`

const ModalBody = styled.div`
  padding: 16px;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
`

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  background-color: ${(props) => (props.variant === "primary" ? "#0f172a" : "#f1f5f9")};
  color: ${(props) => (props.variant === "primary" ? "white" : "#64748b")};
  border: none;
  
  &:hover {
    background-color: ${(props) => (props.variant === "primary" ? "#1e293b" : "#e2e8f0")};
  }
`

interface NewProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
}

/* const initialValues: Product = {
  descripcion: '',
  stock: 0,
  precioUnitario: 0,
  precioCompra: 0,
  categoria: undefined,
  marca: undefined,
  proveedor: undefined,
  codigoBarra: '',
} */

function initialValues(product: Product): Product {
  return product
}

export default function EditProduct({ isOpen, onClose, product }: NewProductModalProps) {
  
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: initialValues(product),
    onSubmit: (formValue: Product) => {
      if (formValue.name === '' || formValue.stock <= 0 || formValue.precioUnitario <= 0){
        dispatch(setAlert({
          message: `Falta nombre o stock o precio unitario o son menor a 0`,
          type: 'error'
        }))
        return
      }
      dispatch(setLoading(true))
      apiClient.patch(`/product/${product._id}`, formValue)
      .then(async (r)=>{
        dispatch(setLoading(false))
        dispatch(setAlert({
          message: `Producto modificado correctamente`,
          type: 'success'
        }))
        formik.resetForm()
        onClose()
      })
      .catch((e)=>{
        dispatch(setLoading(false))
        dispatch(setAlert({
        message: `${e.response.data.error || e.response.data || 'Error al modificar el producto'}`,
        type: 'error'
        }))
      })
    }
  }) 

  useEffect(() => {
    formik.resetForm({ values: initialValues(product) })
  }, [product])

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        
        <ModalHeader>
          <ModalTitle>Editar Producto</ModalTitle>
          <CloseButton type="button" onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <Input label={'Nombre'} name={'name'} value={formik.values.name} onChange={formik.handleChange} type='text' required={true} />
          <Input label={'Codigo barra'} name={'codigoBarra'} value={formik.values.codigoBarra} onChange={formik.handleChange} type='text' />
          <Input label={'Stock'} name={'stock'} value={formik.values.stock} onChange={formik.handleChange} type='number' required={true} />
          <Input label={'Precio unitario'} name={'precioUnitario'} value={formik.values.precioUnitario} onChange={formik.handleChange} type='number' required={true} />
          <Input label={'Precio compra'} name={'precioCompra'} value={formik.values.precioCompra} onChange={formik.handleChange} type='number' />
          <InputSelectAdd type={'text'} label={'Categoria'} name={'NameCategoria'} path={'categorie'} idSelect={formik.values.categoria as string} value={formik.values.NameCategoria} onChange={(id:any, item:any)=>{
              formik.setFieldValue('categoria', id)
              formik.setFieldValue('NameCategoria', item.name)
            }} />
          <InputSelectAdd type={'text'} label={'Marca'} name={'NameMarca'} path={'brand'} idSelect={formik.values.marca as string} value={formik.values.NameMarca} onChange={(id:any, item:any)=>{
              formik.setFieldValue('marca', id)
              formik.setFieldValue('NameMarca', item.name)
            }} />
          <InputSelectAdd type={'text'} label={'Proveedor'} name={'NameProveedor'} path={'provider'} idSelect={formik.values.proveedor as string} value={formik.values.NameProveedor} onChange={(id:any, item:any)=>{
              formik.setFieldValue('proveedor', id)
              formik.setFieldValue('NameProveedor', item.name)
            }} />
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="primary" onClick={(e)=>{e.preventDefault();formik.handleSubmit()}}>
            Guardar
          </Button>
        </ModalFooter>
        
      </ModalContainer>
    </ModalOverlay>
  )
}
