"use client"

import styled from "styled-components"

// Interfaces
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
const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TimeRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const TimeLabel = styled.div`
  width: 60px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
`

const SlotsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  
  /* Hide scrollbar but keep functionality */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`

const TimeSlot = styled.button<{ $estado: "disponible" | "reservado" | "cancelado" }>`
  width: 100px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  
  background-color: ${(props) => {
    switch (props.$estado) {
      case "disponible":
        return "#f1f5f9"
      case "reservado":
        return "#fee2e2"
      case "cancelado":
        return "#fef3c7"
      default:
        return "#f1f5f9"
    }
  }};
  
  color: ${(props) => {
    switch (props.$estado) {
      case "disponible":
        return "#64748b"
      case "reservado":
        return "#b91c1c"
      case "cancelado":
        return "#92400e"
      default:
        return "#64748b"
    }
  }};
  
  border: 1px solid ${(props) => {
    switch (props.$estado) {
      case "disponible":
        return "#e2e8f0"
      case "reservado":
        return "#fca5a5"
      case "cancelado":
        return "#fde68a"
      default:
        return "#e2e8f0"
    }
  }};
  
  &:hover {
    background-color: ${(props) => {
      switch (props.$estado) {
        case "disponible":
          return "#e2e8f0"
        case "reservado":
          return "#fecaca"
        case "cancelado":
          return "#fde68a"
        default:
          return "#e2e8f0"
      }
    }};
  }
  
  ${(props) =>
    props.$estado === "cancelado" &&
    `
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background-color: #92400e;
      transform: rotate(-5deg);
    }
  `}
`

interface TimeSlotGridProps {
  turnos: Turno[]
  onTurnoClick: (turno: Turno) => void
  selectedDate: Date
}

export default function TimeSlotGrid({ turnos, onTurnoClick, selectedDate }: TimeSlotGridProps) {
  // Group turnos by hour
  const turnosByHour: Record<string, Turno[]> = {}

  turnos.forEach((turno) => {
    const hour = turno.horaInicio.split(":")[0]
    if (!turnosByHour[hour]) {
      turnosByHour[hour] = []
    }
    turnosByHour[hour].push(turno)
  })

  // Sort hours
  const sortedHours = Object.keys(turnosByHour).sort()

  // Format date for display
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }
  const formattedDate = selectedDate.toLocaleDateString("es-ES", dateOptions)

  return (
    <GridContainer>
      <div style={{ marginBottom: "8px", fontSize: "14px", color: "#64748b" }}>Turnos para el {formattedDate}</div>

      {sortedHours.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px", color: "#64748b" }}>
          No hay turnos disponibles para esta fecha.
        </div>
      ) : (
        sortedHours.map((hour) => (
          <TimeRow key={hour}>
            <TimeLabel>{hour}:00</TimeLabel>
            <SlotsContainer>
              {turnosByHour[hour].map((turno) => (
                <TimeSlot
                  key={turno._id}
                  $estado={turno.estado}
                  onClick={() => onTurnoClick(turno)}
                  title={`${turno.horaInicio} - ${turno.horaFin} (${
                    turno.estado === "reservado" ? "Reservado por " + (turno.reservadoPor || "Cliente") : turno.estado
                  })`}
                >
                  {turno.horaInicio}
                </TimeSlot>
              ))}
            </SlotsContainer>
          </TimeRow>
        ))
      )}
    </GridContainer>
  )
}
