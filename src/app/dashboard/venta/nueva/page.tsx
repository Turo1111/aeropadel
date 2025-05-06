"use client"

import { useEffect, useState } from "react"
import { FaArrowLeft, FaPlus, FaMinus, FaTrash, FaSave } from "react-icons/fa"
import styled from "styled-components"
import Link from "next/link"
import ListProductSale from "@/components/venta/ListProductSale"
import LineaVenta from "@/components/venta/LineaVenta"
import DataSale from "@/components/venta/DataSale"
import { resetSale } from "@/redux/saleSlice"
import { useRouter } from "next/navigation"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useAppDispatch } from "@/redux/hook"

// Styled Components
const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  @media only screen and (max-width: 650px) {
    padding: 5px;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`

const BackButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border-radius: 6px;
  background-color: #f1f5f9;
  color: #64748b;
  margin-right: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #e2e8f0;
  }
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
`

const Content = styled.div`
  gap: 24px;
  display: flex;
  flex: 1;
  @media (max-width: 650px) {
    flex-direction: column;
  }
`


export default function NuevaVentaPage() {

  const dispatch = useAppDispatch();
  const router: AppRouterInstance = useRouter()
  
  useEffect(()=>{
    dispatch(resetSale({}))
  }, [router, dispatch])

  return (
    <Container>
      <Header>
        <Link href="/dashboard/venta" passHref legacyBehavior>
          <BackButton>
            <FaArrowLeft />
          </BackButton>
        </Link>
        <Title>Nueva Venta</Title>
      </Header>

      <Content>
        <ListProductSale/>
        <SecondContainer>
          <LineaVenta/>
          <DataSale/>
        </SecondContainer>
      </Content>
    </Container>
  )
}

const SecondContainer = styled.div `
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: 50%;
  @media only screen and (max-width: 650px) {
    max-width: 100%;
  }
`
