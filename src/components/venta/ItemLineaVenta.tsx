import React from 'react'
import styled from 'styled-components'
import { BiTrash } from 'react-icons/bi'

interface ItemLV {
    name: string
    downQTY10: ()=>void
    downQTY:()=>void
    upQTY:()=>void
    upQTY10:()=>void
    cantidad: number
    total: number
    deleteItem:()=>void
}

export default function ItemLineaVenta({name, downQTY, downQTY10, upQTY, upQTY10, cantidad, total, deleteItem}: ItemLV) {
  return (
    <Item>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Description>{name}</Description>
            <IconWrapper>
                <BiTrash style={{fontSize: 20, margin: '0 5px', color: '#F7A4A4'}} onClick={deleteItem}/>
            </IconWrapper>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <QtyInput>
                <QtyCountMinus onClick={downQTY10}>-10</QtyCountMinus>
                <QtyCountMinus onClick={downQTY}>-</QtyCountMinus>
                <ProductQty type="number" value={cantidad} readOnly />
                <QtyCountAdd onClick={upQTY}>+</QtyCountAdd>
                <QtyCountAdd onClick={upQTY10}>+10</QtyCountAdd>
            </QtyInput>
            <h2 style={{fontSize: 16, fontWeight: 600, color: '#FA9B50', textAlign: 'center'}}>$ {total}</h2>
        </div>
    </Item>
  )
}

const Item = styled.li `
  list-style: none;
  padding: 8px;
  font-weight: 600;
  width: 100%;
  border-bottom: 1px solid #d1d1d1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  @media only screen and (max-width: 500px) {
    flex-direction: column;
    justify-content: center;
    padding: 15px 0;
  }
`

const Description = styled.h2 `
    font-size: 16px;
    color: #252525;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 95%;
    @media only screen and (max-width: 500px) { 
        font-size: 16px
    } 
`

const QtyInput = styled.div`
    color: #252525;
    background: #fff;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 0.5em 1em -0.9em rgba(0, 0, 0, 0.7);
    transform: scale(1);
    font-size: 16px;
    border: solid 1px #d9d9d9;
    @media only screen and (max-width: 650px) { 
        font-size: 14px;
    } 
`

const ProductQty = styled.input`
    background: transparent;
    color: inherit;
    font-weight: bold;
    font-size: inherit;
    border: none;
    display: inline-block;
    min-width: 0;
    height: 2rem;
    line-height: 1;
    width: 40px;
    text-align: center;
    appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        appearance: none;
        margin: 0;
    }
    
    &:focus {
        outline: none;
    }
`

const QtyCount = styled.button`
    background: transparent;
    color: inherit;
    font-weight: bold;
    font-size: inherit;
    border: none;
    display: inline-block;
    min-width: 25px;
    height: 2rem;
    line-height: 1;
    padding: 0 5px;
    cursor: pointer;
    width: auto;
    font-size: 1em;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:focus {
        outline: none;
    }
    
    &:disabled {
        color: #ccc;
        background: #f2f2f2;
        cursor: not-allowed;
        border-color: transparent;
    }
`

const QtyCountMinus = styled(QtyCount)`
    border-right: 1px solid #e2e2e2;
`

const QtyCountAdd = styled(QtyCount)`
    border-left: 1px solid #e2e2e2;
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 15px;
    transition: transform .5s linear;
    cursor: pointer;
    &:hover {
        background-color: #d1d1d1;
    }
`