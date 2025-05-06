"use client"

import styled from "styled-components"

// Interfaces
interface Local {
  _id: string
  nombre: string
  direccion: string
  telefono?: string
  email?: string
  precioHora: number
  horarios: {
    apertura: string
    cierre: string
  }
}

// Styled Components
const TabsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 8px;
  padding-bottom: 8px;
  margin-bottom: 16px;
  
  /* Hide scrollbar but keep functionality */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  
  background-color: ${(props) => (props.$active ? "#3b82f6" : "#f1f5f9")};
  color: ${(props) => (props.$active ? "white" : "#64748b")};
  border: none;
  
  &:hover {
    background-color: ${(props) => (props.$active ? "#2563eb" : "#e2e8f0")};
  }
`

interface LocationTabsProps {
  locales: Local[]
  selectedLocalId: string
  onSelectLocal: (localId: string) => void
}

export default function LocationTabs({ locales, selectedLocalId, onSelectLocal }: LocationTabsProps) {
  return (
    <TabsContainer>
      {locales.map((local) => (
        <Tab key={local._id} $active={local._id === selectedLocalId} onClick={() => onSelectLocal(local._id)}>
          {local.nombre}
        </Tab>
      ))}
    </TabsContainer>
  )
}
