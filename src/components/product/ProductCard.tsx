"use client"

import { useSession } from "next-auth/react"
import { FaEdit, FaInfoCircle, FaPrint } from "react-icons/fa"
import styled from "styled-components"

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  @media only screen and (max-width: 500px) {
    flex-direction: column;
    align-items: normal;
  }
`

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const ProductName = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
  @media only screen and (max-width: 600px) {
    font-size: 16px;
  }
  @media only screen and (max-width: 400px) {
    font-size: 14px;
  }
`

const ProductCategory = styled.div`
  font-size: 16px;
  color: #64748b;
  @media only screen and (max-width: 600px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 400px) {
    font-size: 12px;
  }
`

const ProductPrice = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #fb923c; /* Pastel orange color */
  text-align: end;
  @media only screen and (max-width: 600px) {
    font-size: 16px;
  }
  @media only screen and (max-width: 400px) {
    font-size: 14px;
  }
`

interface ProductCardProps {
  name: string
  category: string
  price: number
  stock: number
  onEdit?: ()=>void
  onClick?: ()=>void
}

export default function ProductCard({ name, category, price, stock, onEdit, onClick }: ProductCardProps) {
  const { data: session } = useSession();


  return (
    <Card onClick={onClick} >
      <div style={{display: "flex", justifyContent: "space-between", flex: 1}} >
        <ProductInfo>
          <ProductName>{name}</ProductName>
          <ProductCategory>{category}</ProductCategory>
        </ProductInfo>
        <ProductInfo>
          <ProductPrice>${price.toFixed(2)}</ProductPrice>
          <ProductCategory>{`${stock} unidades`}</ProductCategory>
        </ProductInfo>
      </div>
      {
        onEdit &&
        session?.user?.role?.permissions?.includes("update_product") &&
        <ActionButtons>
          <ActionButton $variant="edit" title="Editar" onClick={onEdit}>
            <FaEdit size={14} />
          </ActionButton>
        </ActionButtons>
      }
    </Card>
  )
}

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-left: 15px;
`

const ActionButton = styled.button<{ $variant?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: none;
  background-color: ${(props) => {
    switch (props.$variant) {
      case "info":
        return "#e0f2fe"
      case "edit":
        return "#ecfccb"
      case "print":
        return "#f1f5f9"
      default:
        return "#f1f5f9"
    }
  }};
  color: ${(props) => {
    switch (props.$variant) {
      case "info":
        return "#0284c7"
      case "edit":
        return "#65a30d"
      case "print":
        return "#64748b"
      default:
        return "#64748b"
    }
  }};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => {
      switch (props.$variant) {
        case "info":
          return "#bae6fd"
        case "edit":
          return "#d9f99d"
        case "print":
          return "#e2e8f0"
        default:
          return "#e2e8f0"
      }
    }};
  }
`
