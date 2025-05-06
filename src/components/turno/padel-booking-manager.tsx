"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { FaPlus, FaCalendarAlt } from "react-icons/fa"
import LocationTabs from "./location-tabs"
import CourtSelector from "./court-selector"
import WeeklySchedule from "./weekly-schedule"
import LocalModal from "./local-modal"
import CanchaModal from "./cancha-modal"
import BookingModal from "./booking-modal"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

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
const Container = styled.div`
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    padding: 24px;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
`

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #0f172a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1e293b;
  }
`

const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`

const DatePickerLabel = styled.div`
  font-weight: 500;
  color: #64748b;
`

const StyledDatePicker = styled.div`
  .react-datepicker-wrapper {
    width: auto;
  }

  .react-datepicker__input-container input {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
    }
  }
`

// Sample data
const sampleLocales: Local[] = [
  {
    _id: "1",
    nombre: "Padel Club Centro",
    direccion: "Av. Principal 123",
    telefono: "555-1234",
    email: "centro@padelclub.com",
    precioHora: 2500,
    horarios: {
      apertura: "08:00",
      cierre: "22:00",
    },
  },
  {
    _id: "2",
    nombre: "Padel Club Norte",
    direccion: "Calle Norte 456",
    telefono: "555-5678",
    email: "norte@padelclub.com",
    precioHora: 2800,
    horarios: {
      apertura: "09:00",
      cierre: "23:00",
    },
  },
  {
    _id: "3",
    nombre: "Padel Club Sur",
    direccion: "Av. Sur 789",
    telefono: "555-9012",
    email: "sur@padelclub.com",
    precioHora: 2200,
    horarios: {
      apertura: "08:00",
      cierre: "21:00",
    },
  },
]

const sampleCanchas: Cancha[] = [
  {
    _id: "1",
    nombre: "Cancha 1",
    tipo: "pasto_sintetico",
    cubierta: true,
    iluminacion: true,
    activa: true,
    localId: "1",
  },
  {
    _id: "2",
    nombre: "Cancha 2",
    tipo: "cemento",
    cubierta: false,
    iluminacion: true,
    activa: true,
    localId: "1",
  },
  {
    _id: "3",
    nombre: "Cancha 3",
    tipo: "alfombra",
    cubierta: true,
    iluminacion: true,
    activa: true,
    localId: "1",
  },
  {
    _id: "4",
    nombre: "Cancha 1",
    tipo: "pasto_sintetico",
    cubierta: true,
    iluminacion: true,
    activa: true,
    localId: "2",
  },
  {
    _id: "5",
    nombre: "Cancha 2",
    tipo: "pasto_sintetico",
    cubierta: true,
    iluminacion: true,
    activa: true,
    localId: "2",
  },
  {
    _id: "6",
    nombre: "Cancha 1",
    tipo: "cemento",
    cubierta: false,
    iluminacion: true,
    activa: true,
    localId: "3",
  },
]

// Generate sample turnos for today
const generateSampleTurnos = (selectedDate: Date): Turno[] => {
  const turnos: Turno[] = []

  // Obtener el lunes de la semana actual
  const currentDay = new Date(selectedDate)
  const dayOfWeek = currentDay.getDay()
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Ajustar para que el lunes sea el primer día
  const monday = new Date(currentDay)
  monday.setDate(currentDay.getDate() - diff)

  // Generar turnos para cada día de la semana
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = new Date(monday)
    currentDate.setDate(monday.getDate() + dayOffset)
    const dateStr = currentDate.toISOString().split("T")[0]

    // Generar turnos para cada cancha
    sampleCanchas.forEach((cancha) => {
      // Find the local for this cancha
      const local = sampleLocales.find((l) => l._id === cancha.localId)
      if (!local) return

      // Parse opening and closing hours
      const openingHour = Number.parseInt(local.horarios.apertura.split(":")[0])
      const closingHour = Number.parseInt(local.horarios.cierre.split(":")[0])

      // Generate turnos for each half hour
      for (let hour = openingHour; hour < closingHour; hour++) {
        for (const minute of [0, 30]) {
          const horaInicio = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
          const endMinute = minute === 0 ? 30 : 0
          const endHour = minute === 0 ? hour : hour + 1
          const horaFin = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`

          // Randomly assign estado
          const randomStatus = Math.random()
          let estado: "disponible" | "reservado" | "cancelado" = "disponible"
          if (randomStatus < 0.3) {
            estado = "reservado"
          } else if (randomStatus < 0.4) {
            estado = "cancelado"
          }

          turnos.push({
            _id: `${cancha._id}-${dateStr}-${horaInicio}`,
            canchaId: cancha._id,
            localId: cancha.localId,
            fecha: dateStr,
            horaInicio,
            horaFin,
            estado,
            precio: local.precioHora,
            reservadoPor: estado === "reservado" ? "Cliente Ejemplo" : undefined,
          })
        }
      }
    })
  }

  return turnos
}

export default function PadelBookingManager() {
  const [locales, setLocales] = useState<Local[]>(sampleLocales)
  const [canchas, setCanchas] = useState<Cancha[]>(sampleCanchas)
  const [selectedLocalId, setSelectedLocalId] = useState<string>(sampleLocales[0]._id)
  const [selectedCanchaId, setSelectedCanchaId] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [isLocalModalOpen, setIsLocalModalOpen] = useState(false)
  const [isCanchaModalOpen, setIsCanchaModalOpen] = useState(false)
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  // Filtrar canchas por local seleccionado
  const filteredCanchas = canchas.filter((cancha) => cancha.localId === selectedLocalId)

  // Seleccionar la primera cancha por defecto cuando cambia el local
  useEffect(() => {
    if (filteredCanchas.length > 0 && (!selectedCanchaId || !filteredCanchas.some((c) => c._id === selectedCanchaId))) {
      setSelectedCanchaId(filteredCanchas[0]._id)
    }
  }, [selectedLocalId, filteredCanchas, selectedCanchaId])

  // Generate turnos when date or selected local changes
  useEffect(() => {
    setTurnos(generateSampleTurnos(selectedDate))
  }, [selectedDate, selectedLocalId])

  const handleLocalSelect = (localId: string) => {
    setSelectedLocalId(localId)
  }

  const handleCanchaSelect = (canchaId: string) => {
    setSelectedCanchaId(canchaId)
  }

  const handleAddLocal = (local: Omit<Local, "_id">) => {
    const newLocal: Local = {
      ...local,
      _id: Date.now().toString(),
    }
    setLocales([...locales, newLocal])
    setSelectedLocalId(newLocal._id)
    setIsLocalModalOpen(false)
  }

  const handleAddCancha = (cancha: Omit<Cancha, "_id" | "localId">) => {
    const newCancha: Cancha = {
      ...cancha,
      _id: Date.now().toString(),
      localId: selectedLocalId,
    }
    setCanchas([...canchas, newCancha])
    setSelectedCanchaId(newCancha._id)
    setIsCanchaModalOpen(false)
  }

  const handleTurnoClick = (turno: Turno) => {
    setSelectedTurno(turno)
    setIsBookingModalOpen(true)
  }

  const handleBookingConfirm = (turno: Turno, action: "reservar" | "cancelar") => {
    const updatedTurnos = turnos.map((t) => {
      if (t._id === turno._id) {
        return {
          ...t,
          estado: action === "reservar" ? "reservado" : "disponible",
          reservadoPor: action === "reservar" ? "Nuevo Cliente" : undefined,
        }
      }
      return t
    })
    setTurnos(updatedTurnos)
    setIsBookingModalOpen(false)
  }

  // Obtener el lunes de la semana actual para el selector de semana
  const getMonday = (d: Date) => {
    const date = new Date(d)
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(date.setDate(diff))
  }

  const monday = getMonday(selectedDate)
  const formatWeekRange = () => {
    const mondayStr = monday.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    const sundayStr = sunday.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
    return `${mondayStr} - ${sundayStr}`
  }

  return (
    <Container>
      <Header>
        <Title>Administración de Turnos</Title>
      </Header>

      <LocationTabs locales={locales} selectedLocalId={selectedLocalId} onSelectLocal={handleLocalSelect} />

      <ButtonsContainer style={{ marginBottom: "24px" }}>
        <Button onClick={() => setIsLocalModalOpen(true)}>
          <FaPlus size={14} />
          Nuevo Local
        </Button>
        <Button onClick={() => setIsCanchaModalOpen(true)}>
          <FaPlus size={14} />
          Nueva Cancha
        </Button>
      </ButtonsContainer>

      <DatePickerContainer>
        <FaCalendarAlt size={18} color="#64748b" />
        <DatePickerLabel>Semana:</DatePickerLabel>
        <StyledDatePicker>
          <DatePicker
            selected={monday}
            onChange={(date: Date) => setSelectedDate(date)}
            dateFormat="'Semana del' dd/MM/yyyy"
          />
        </StyledDatePicker>
        <div style={{ marginLeft: "10px", fontSize: "14px" }}>{formatWeekRange()}</div>
      </DatePickerContainer>

      {/* Selector de canchas */}
      <CourtSelector
        canchas={filteredCanchas}
        selectedCanchaId={selectedCanchaId}
        onSelectCancha={handleCanchaSelect}
      />

      {/* Vista semanal */}
      {selectedCanchaId && (
        <WeeklySchedule
          turnos={turnos.filter((turno) => turno.canchaId === selectedCanchaId)}
          onTurnoClick={handleTurnoClick}
          selectedDate={monday}
        />
      )}

      {/* Modals */}
      <LocalModal isOpen={isLocalModalOpen} onClose={() => setIsLocalModalOpen(false)} onSave={handleAddLocal} />

      <CanchaModal isOpen={isCanchaModalOpen} onClose={() => setIsCanchaModalOpen(false)} onSave={handleAddCancha} />

      {selectedTurno && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          turno={selectedTurno}
          onConfirm={handleBookingConfirm}
        />
      )}
    </Container>
  )
}
