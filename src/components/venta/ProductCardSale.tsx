"use client"

import styled from "styled-components"

const Card = styled.li`
  display: flex;
  list-style: none;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
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
  font-size: 16px;
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
  font-size: 14px;
  color: #64748b;
  @media only screen and (max-width: 400px) {
    font-size: 12px;
  }
`

const ProductPrice = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #fb923c; /* Pastel orange color */
  text-align: end;
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

export default function ProductCardSale({ name, category, price, stock, onEdit, onClick }: ProductCardProps) {

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
    </Card>
  )
}
