"use client"

import styled from "styled-components"
import TimeSlotGrid from "./time-slot-grid"

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

interface Turno {
  _id: string
  canchaId: string
  localId: string
  fecha: string
  horaInicio: string
  horaFin: string
  reservadoPor?: string
  estado: "disponible" | "reservado" | "cancelado"
  precio: number
}

// Styled Components
const CourtListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const CourtItem = styled.div`
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`

const CourtHeader = styled.div`
  padding: 12px 16px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CourtName = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`

const CourtDetails = styled.div`
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #64748b;
`

const CourtDetail = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`

const CourtContent = styled.div`
  padding: 16px;
  overflow-x: auto;
`

const tipoToString = (tipo: "pasto_sintetico" | "cemento" | "alfombra"): string => {
  switch (tipo) {
    case "pasto_sintetico":
      return "Pasto Sintético"
    case "cemento":
      return "Cemento"
    case "alfombra":
      return "Alfombra"
    default:
      return tipo
  }
}

interface CourtListProps {
  canchas: Cancha[]
  turnos: Turno[]
  onTurnoClick: (turno: Turno) => void
  selectedDate: Date
}

export default function CourtList({ canchas, turnos, onTurnoClick, selectedDate }: CourtListProps) {
  return (
    <CourtListContainer>
      {canchas.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
          No hay canchas disponibles para este local. Agregue una nueva cancha.
        </div>
      ) : (
        canchas.map((cancha) => {
          const canchaType = tipoToString(cancha.tipo)
          const canchaDetails = []

          if (cancha.cubierta) canchaDetails.push("Cubierta")
          if (cancha.iluminacion) canchaDetails.push("Iluminación")

          const canchaDetailText = canchaDetails.join(" • ")

          const canchaStatus = cancha.activa ? "Activa" : "Inactiva"

          const canchaStatusColor = cancha.activa ? "#10b981" : "#ef4444"

          const canchaStatusStyle = {
            color: canchaStatusColor,
            fontWeight: 500,
          }

          const canchaTurnos = turnos.filter((turno) => turno.canchaId === cancha._id)

          return (
            <CourtItem key={cancha._id}>
              <CourtHeader>
                <CourtName>{cancha.nombre}</CourtName>
                <CourtDetails>
                  <CourtDetail>{canchaType}</CourtDetail>
                  {canchaDetailText && <CourtDetail>•</CourtDetail>}
                  {canchaDetailText && <CourtDetail>{canchaDetailText}</CourtDetail>}
                  <CourtDetail>•</CourtDetail>
                  <CourtDetail style={canchaStatusStyle}>{canchaStatus}</CourtDetail>
                </CourtDetails>
              </CourtHeader>
              <CourtContent>
                <TimeSlotGrid turnos={canchaTurnos} onTurnoClick={onTurnoClick} selectedDate={selectedDate} />
              </CourtContent>
            </CourtItem>
          )
        })
      )}
    </CourtListContainer>
  )
}
