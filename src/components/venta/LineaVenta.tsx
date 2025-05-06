import { ExtendItemSale, ItemSale } from '@/interfaces/sale.interface'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { deleteItemSale, downQTY10Sale, downQTYSale, getItemSale, upQTY10Sale, upQTYSale } from '@/redux/saleSlice'
import React, { useState } from 'react'
import styled from 'styled-components'
import ItemLineaVenta from './ItemLineaVenta'

export default function LineaVenta() {

    const itemSale = useAppSelector(getItemSale)
    const dispatch = useAppDispatch();

  return (
    <Section>
      <SectionHeader>Productos Seleccionados</SectionHeader>
      <SectionContent>
        {itemSale.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8" }}>
            No hay productos seleccionados
          </div>
        ) : (
          <>
            <SelectedProductsList>
              {
                itemSale.map((item: ExtendItemSale, index: number)=>(
                    <ItemLineaVenta key={index}
                        name={item.name || 'Sin decripcion'} cantidad={item.cantidad} total={item.total}
                        downQTY={()=>dispatch(downQTYSale({id: item.idProducto}))}
                        downQTY10={()=>dispatch(downQTY10Sale({id: item.idProducto}))}
                        upQTY={()=>dispatch(upQTYSale({id: item.idProducto}))}
                        upQTY10={()=>dispatch(upQTY10Sale({id: item.idProducto}))}
                        deleteItem={()=>dispatch(deleteItemSale({id: item.idProducto}))}
                    />
                ))
              }
            </SelectedProductsList>
          </>
        )}
      </SectionContent>
    </Section>
  )
}


const Section = styled.section`
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  max-height: 70vh;
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
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: scroll;
  padding-top: 0px;
  @media only screen and (max-width: 650px) {
    max-height: 40vh;
  }
`


const SelectedProductsList = styled.div`
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
  }
`