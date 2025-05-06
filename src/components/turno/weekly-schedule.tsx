"use client"

import React from "react"

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
const ScheduleContainer = styled.div`
  border: 1px solid #000;
  border-radius: 4px;
  overflow: hidden;
`

const ScheduleHeader = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  border-bottom: 1px solid #000;
`

const HeaderCell = styled.div`
  padding: 12px 8px;
  font-weight: 600;
  text-align: center;
  border-right: 1px solid #000;
  
  &:last-child {
    border-right: none;
  }
`

const ScheduleBody = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
`

const TimeCell = styled.div`
  padding: 8px;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:last-child {
    border-bottom: none;
  }
`

const SlotCell = styled.div<{ $estado: "disponible" | "reservado" | "cancelado" }>`
  padding: 8px;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  
  background-color: ${(props) => {
    switch (props.$estado) {
      case "disponible":
        return "#fff"
      case "reservado":
        return "#fee2e2"
      case "cancelado":
        return "#fef3c7"
      default:
        return "#fff"
    }
  }};
  
  &:hover {
    background-color: ${(props) => {
      switch (props.$estado) {
        case "disponible":
          return "#f1f5f9"
        case "reservado":
          return "#fecaca"
        case "cancelado":
          return "#fde68a"
        default:
          return "#f1f5f9"
      }
    }};
  }
  
  &:last-child {
    border-right: none;
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

interface WeeklyScheduleProps {
  turnos: Turno[]
  onTurnoClick: (turno: Turno) => void
  selectedDate: Date
}

export default function WeeklySchedule({ turnos, onTurnoClick, selectedDate }: WeeklyScheduleProps) {
  // Obtener los días de la semana a partir de la fecha seleccionada (que debe ser un lunes)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(selectedDate)
    day.setDate(selectedDate.getDate() + i)
    return day
  })

  // Obtener las horas únicas de los turnos
  const hours = Array.from(new Set(turnos.map((turno) => turno.horaInicio.split(":")[0]))).sort()

  // Obtener los minutos únicos (0 y 30)
  const minutes = ["00", "30"]

  // Crear un mapa para acceder rápidamente a los turnos por fecha y hora
  const turnoMap: Record<string, Record<string, Turno>> = {}

  turnos.forEach((turno) => {
    if (!turnoMap[turno.fecha]) {
      turnoMap[turno.fecha] = {}
    }
    turnoMap[turno.fecha][turno.horaInicio] = turno
  })

  // Función para obtener el turno correspondiente a una fecha y hora
  const getTurno = (date: Date, hour: string, minute: string): Turno | undefined => {
    const dateStr = date.toISOString().split("T")[0]
    const timeStr = `${hour}:${minute}`
    return turnoMap[dateStr]?.[timeStr]
  }

  // Nombres de los días de la semana en español
  const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

  return (
    <ScheduleContainer>
      <ScheduleHeader>
        <HeaderCell></HeaderCell>
        {dayNames.map((day, index) => (
          <HeaderCell key={index}>{day}</HeaderCell>
        ))}
      </ScheduleHeader>

      <ScheduleBody>
        {hours.flatMap((hour) =>
          minutes.map((minute, minuteIndex) => {
            const timeStr = `${hour}:${minute}`
            return (
              <React.Fragment key={`${hour}-${minute}`}>
                <TimeCell>{timeStr}</TimeCell>
                {weekDays.map((day, dayIndex) => {
                  const turno = getTurno(day, hour, minute)
                  return (
                    <SlotCell
                      key={dayIndex}
                      $estado={turno?.estado || "disponible"}
                      onClick={() => turno && onTurnoClick(turno)}
                      title={
                        turno
                          ? `${turno.horaInicio} - ${turno.horaFin} (${
                              turno.estado === "reservado"
                                ? "Reservado por " + (turno.reservadoPor || "Cliente")
                                : turno.estado
                            })`
                          : "No disponible"
                      }
                    >
                      {turno?.estado === "reservado" && turno.reservadoPor ? (
                        <div style={{ fontSize: "12px", textAlign: "center" }}>{turno.reservadoPor}</div>
                      ) : null}
                    </SlotCell>
                  )
                })}
              </React.Fragment>
            )
          }),
        )}
      </ScheduleBody>
    </ScheduleContainer>
  )
}
