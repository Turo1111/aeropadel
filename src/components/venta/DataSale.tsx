import { Sale } from '@/interfaces/sale.interface'
import { setAlert } from '@/redux/alertSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { setLoading } from '@/redux/loadingSlice'
import { getSale } from '@/redux/saleSlice'
import apiClient from '@/utils/client'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import React from 'react'
import styled from 'styled-components'

export default function DataSale() {

  const sale = useAppSelector(getSale)
  const dispatch = useAppDispatch();
  const router: AppRouterInstance = useRouter()

  const handleSubmit = () => {
    if (sale.itemsSale.length===0 || sale.total <= 0) {
      dispatch(setAlert({
        message: `No se agregaron productos al carrito`,
        type: 'warning'
      }))
      return
    }
    dispatch(setLoading(true))
    const newSale: Sale = {
      itemsSale: sale.itemsSale, 
      cliente: process.env.NEXT_PUBLIC_CLIENTE_DEFAULT || '681529558dadfe985a8e6147', 
      total: sale.total, 
      estado: "COMPLETADA", 
    }
    apiClient.post('/sale', newSale)
    .then((r)=>{
      dispatch(setLoading(false))
      dispatch(setAlert({
        message: `Venta creada correctamente`,
        type: 'success'
      }))
      router.push(`/dashboard/venta`)
    })
    .catch((e)=>{
      console.log(e)
      dispatch(setLoading(false))
      dispatch(setAlert({
      message: `${e.response.data.error}`,
      type: 'error'
      }))
    })
  }

  return (
    <Section>
      {/* <SectionHeader>Datos de la Venta</SectionHeader> */}
      <SectionContent>
        <Total>
          <span style={{fontWeight: 500}} >TOTAL: </span>
          <span style={{fontWeight: 'bold'}}>$ {sale.total}</span>
        </Total>
        <Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Footer>
      </SectionContent>
    </Section>
  )
}

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
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

const Total = styled.h2 `
    font-size: 18px;
    color: #252525;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    margin-bottom: 16px;
`


const Section = styled.section`
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  margin-top: 15px;
`

const SectionHeader = styled.div`
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 14px;
  background-color: #f8fafc;
`

const SectionContent = styled.div`
  padding: 16px;
`
