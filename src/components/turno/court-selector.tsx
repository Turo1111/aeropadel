"use client"

import styled from "styled-components"

// Interfaces
interface Cancha {
  _id: string
  nombre: string
  tipo: "pasto_sintetico" | "cemento" | "alfombra"
  cubierta: boolean
  iluminacion: boolean
  activa: boolean
  localId: string
}

// Styled Components
const SelectorContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
  
  /* Hide scrollbar but keep functionality */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`

const CourtCard = styled.div<{ $selected: boolean }>`
  min-width: 120px;
  height: 80px;
  border: 2px solid ${(props) => (props.$selected ? "#3b82f6" : "#000")};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) => (props.$selected ? "#f0f7ff" : "#fff")};
  
  &:hover {
    border-color: #3b82f6;
    background-color: #f0f7ff;
  }
`

const CourtName = styled.div`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`

interface CourtSelectorProps {
  canchas: Cancha[]
  selectedCanchaId: string
  onSelectCancha: (canchaId: string) => void
}

export default function CourtSelector({ canchas, selectedCanchaId, onSelectCancha }: CourtSelectorProps) {
  return (
    <SelectorContainer>
      {canchas.length === 0 ? (
        <div style={{ padding: "16px", color: "#64748b" }}>No hay canchas disponibles para este local.</div>
      ) : (
        canchas.map((cancha) => (
          <CourtCard
            key={cancha._id}
            $selected={cancha._id === selectedCanchaId}
            onClick={() => onSelectCancha(cancha._id)}
          >
            <CourtName>{cancha.nombre}</CourtName>
          </CourtCard>
        ))
      )}
    </SelectorContainer>
  )
}
