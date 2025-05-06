"use client"

import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import apiClient from "@/utils/client"
import { ItemSale } from "@/interfaces/sale.interface"

// Styled Components
const PopoverContainer = styled.div`
  position: absolute;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 50;
`

const PopoverHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 14px;
  background-color: #f8fafc;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`

const PopoverBody = styled.div`
  padding: 12px 16px;
`

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const ItemRow = styled.li`
  font-size: 13px;
  padding: 8px 0;
  color: #64748b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`

const ItemName = styled.span`
  color: #0f172a;
  font-weight: 500;
`

const ItemQuantity = styled.span`
  color: #64748b;
  font-size: 12px;
`

const ItemPrice = styled.span`
  color: #0f172a;
  font-weight: 600;
`

const NoItems = styled.div`
  padding: 12px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`

interface InfoPopoverProps {
  anchorEl: HTMLElement
  onClose: () => void
  saleId: string
}

export default function InfoPopover({ anchorEl, onClose, saleId }: InfoPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<ItemSale[]>([])
  const [loading, setLoading] = useState(true)

  console.log(saleId, 'saleId')

  // Position the popover near the anchor element
  useEffect(() => {
    if (popoverRef.current && anchorEl) {
      const anchorRect = anchorEl.getBoundingClientRect()
      const popoverRect = popoverRef.current.getBoundingClientRect()

      // Position to the right of the anchor by default
      let left = anchorRect.right - 46
      let top = anchorRect.top

      // Check if popover would go off the right edge of the screen
      if (left + popoverRect.width > window.innerWidth) {
        // Position to the left of the anchor instead
        left = anchorRect.left - popoverRect.width + 46
      }

      // Check if popover would go off the bottom of the screen
      if (top + popoverRect.height > window.innerHeight) {
        // Adjust top position to fit within screen
        top = Math.max(8, window.innerHeight - popoverRect.height - 8)
      }

      popoverRef.current.style.left = `${left}px`
      popoverRef.current.style.top = `${top}px`
    }
  }, [anchorEl])

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl !== event.target &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [anchorEl, onClose])

  // Fetch sale items
  useEffect(() => {
    const fetchSaleItems = async () => {
      try {
        setLoading(true)
        const { data } = await apiClient.get(`/sale/${saleId}`)
        setItems(data.itemsSale)
        console.log(data, 'data.itemsSale')
      } catch (error) {
        console.error('Error fetching sale items:', error)
      } finally {
        setLoading(false)
      }
    }

    if (saleId) {
      fetchSaleItems()
    }
  }, [saleId])

  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)

  console.log(items, 'items')

  return (
    <PopoverContainer ref={popoverRef}>
      <PopoverHeader>Detalles de la Venta</PopoverHeader>
      <PopoverBody>
        {loading ? (
          <NoItems>Cargando...</NoItems>
        ) : items.length > 0 ? (
          <>
            <ItemList>
              {items.map((item, index) => (
                <ItemRow key={index}>
                  <div>
                    <ItemName>{item.name}</ItemName>
                    <ItemQuantity> x{item.cantidad}</ItemQuantity>
                  </div>
                  <ItemPrice>${(item.precio * item.cantidad).toFixed(2)}</ItemPrice>
                </ItemRow>
              ))}
            </ItemList>
            <ItemRow style={{ marginTop: '12px', borderTop: '2px solid #e5e7eb' }}>
              <ItemName>Total</ItemName>
              <ItemPrice>${total.toFixed(2)}</ItemPrice>
            </ItemRow> 
          </>
        ) : (
          <NoItems>No hay items en esta venta</NoItems>
        )}
      </PopoverBody>
    </PopoverContainer>
  )
}
