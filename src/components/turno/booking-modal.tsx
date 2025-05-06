"use client"

import { useState } from "react"
import styled from "styled-components"
import { FaTimes } from "react-icons/fa"

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
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 100;
`

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
`

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f1f5f9;
  }
`

const ModalBody = styled.div`
  padding: 16px;
`

const TurnoInfo = styled.div`
  margin-bottom: 16px;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
`

const InfoLabel = styled.span`
  color: #64748b;
`

const InfoValue = styled.span`
  font-weight: 500;
`

const FormGroup = styled.div`
  margin-bottom: 16px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #64748b;
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #94a3b8;
    box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.2);
  }
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
`

const Button = styled.button<{ $variant?: "primary" | "secondary" | "danger" }>`
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  background-color: ${(props) => {
    switch (props.$variant) {
      case "primary":
        return "#3b82f6"
      case "danger":
        return "#ef4444"
      default:
        return "#f1f5f9"
    }
  }};
  
  color: ${(props) => {
    switch (props.$variant) {
      case "primary":
      case "danger":
        return "white"
      default:
        return "#64748b"
    }
  }};
  
  border: none;
  
  &:hover {
    background-color: ${(props) => {
      switch (props.$variant) {
        case "primary":
          return "#2563eb"
        case "danger":
          return "#dc2626"
        default:
          return "#e2e8f0"
      }
    }};
  }
`

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  turno: Turno
  onConfirm: (turno: Turno, action: "reservar" | "cancelar") => void
}

export default function BookingModal({ isOpen, onClose, turno, onConfirm }: BookingModalProps) {
  const [clientName, setClientName] = useState("")

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
  }

  const handleReservar = () => {
    if (turno.estado === "disponible" && !clientName.trim()) {
      alert("Por favor ingrese el nombre del cliente")
      return
    }
    onConfirm(turno, "reservar")
  }

  const handleCancelar = () => {
    onConfirm(turno, "cancelar")
  }

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {turno.estado === "disponible"
              ? "Reservar Turno"
              : turno.estado === "reservado"
                ? "Cancelar Reserva"
                : "Turno Cancelado"}
          </ModalTitle>
          <CloseButton type="button" onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <TurnoInfo>
            <InfoRow>
              <InfoLabel>Fecha:</InfoLabel>
              <InfoValue>{formatDate(turno.fecha)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Horario:</InfoLabel>
              <InfoValue>
                {turno.horaInicio} - {turno.horaFin}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Precio:</InfoLabel>
              <InfoValue>${turno.precio}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Estado:</InfoLabel>
              <InfoValue
                style={{
                  color:
                    turno.estado === "disponible" ? "#10b981" : turno.estado === "reservado" ? "#ef4444" : "#d97706",
                }}
              >
                {turno.estado === "disponible"
                  ? "Disponible"
                  : turno.estado === "reservado"
                    ? "Reservado"
                    : "Cancelado"}
              </InfoValue>
            </InfoRow>
            {turno.estado === "reservado" && turno.reservadoPor && (
              <InfoRow>
                <InfoLabel>Reservado por:</InfoLabel>
                <InfoValue>{turno.reservadoPor}</InfoValue>
              </InfoRow>
            )}
          </TurnoInfo>

          {turno.estado === "disponible" && (
            <FormGroup>
              <Label htmlFor="clientName">Nombre del cliente</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ingrese el nombre del cliente"
              />
            </FormGroup>
          )}

          {turno.estado === "cancelado" && (
            <div style={{ textAlign: "center", padding: "16px", color: "#d97706" }}>
              Este turno ha sido cancelado y no puede ser modificado.
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button type="button" $variant="secondary" onClick={onClose}>
            Cerrar
          </Button>

          {turno.estado === "disponible" && (
            <Button type="button" $variant="primary" onClick={handleReservar}>
              Reservar
            </Button>
          )}

          {turno.estado === "reservado" && (
            <Button type="button" $variant="danger" onClick={handleCancelar}>
              Cancelar Reserva
            </Button>
          )}
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  )
}
