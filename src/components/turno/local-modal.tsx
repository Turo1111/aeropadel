"use client"

import type React from "react"

import { useState } from "react"
import styled from "styled-components"
import { FaTimes } from "react-icons/fa"

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
  max-width: 500px;
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

const HorariosContainer = styled.div`
  display: flex;
  gap: 16px;
`

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
`

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  background-color: ${(props) => (props.$variant === "primary" ? "#3b82f6" : "#f1f5f9")};
  color: ${(props) => (props.$variant === "primary" ? "white" : "#64748b")};
  border: none;
  
  &:hover {
    background-color: ${(props) => (props.$variant === "primary" ? "#2563eb" : "#e2e8f0")};
  }
`

interface LocalModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (localData: Omit<Local, "_id">) => void
}

export default function LocalModal({ isOpen, onClose, onSave }: LocalModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    precioHora: "",
    horarioApertura: "08:00",
    horarioCierre: "22:00",
  })
  const [errors, setErrors] = useState({
    nombre: "",
    direccion: "",
    precioHora: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear errors when typing
    if (name === "nombre" || name === "direccion" || name === "precioHora") {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { nombre: "", direccion: "", precioHora: "" }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
      valid = false
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria"
      valid = false
    }

    if (!formData.precioHora.trim()) {
      newErrors.precioHora = "El precio por hora es obligatorio"
      valid = false
    } else if (isNaN(Number(formData.precioHora)) || Number(formData.precioHora) <= 0) {
      newErrors.precioHora = "El precio debe ser un número positivo"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const localData: Omit<Local, "_id"> = {
      nombre: formData.nombre,
      direccion: formData.direccion,
      telefono: formData.telefono || undefined,
      email: formData.email || undefined,
      precioHora: Number(formData.precioHora),
      horarios: {
        apertura: formData.horarioApertura,
        cierre: formData.horarioCierre,
      },
    }

    onSave(localData)

    // Reset form
    setFormData({
      nombre: "",
      direccion: "",
      telefono: "",
      email: "",
      precioHora: "",
      horarioApertura: "08:00",
      horarioCierre: "22:00",
    })
  }

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>Nuevo Local</ModalTitle>
            <CloseButton type="button" onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingrese el nombre del local"
              />
              {errors.nombre && <ErrorMessage>{errors.nombre}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ingrese la dirección"
              />
              {errors.direccion && <ErrorMessage>{errors.direccion}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ingrese el teléfono (opcional)"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingrese el email (opcional)"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="precioHora">Precio por hora *</Label>
              <Input
                id="precioHora"
                name="precioHora"
                type="number"
                min="0"
                step="100"
                value={formData.precioHora}
                onChange={handleChange}
                placeholder="Ingrese el precio por hora"
              />
              {errors.precioHora && <ErrorMessage>{errors.precioHora}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Horarios</Label>
              <HorariosContainer>
                <div style={{ flex: 1 }}>
                  <Label htmlFor="horarioApertura">Apertura</Label>
                  <Input
                    id="horarioApertura"
                    name="horarioApertura"
                    type="time"
                    value={formData.horarioApertura}
                    onChange={handleChange}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Label htmlFor="horarioCierre">Cierre</Label>
                  <Input
                    id="horarioCierre"
                    name="horarioCierre"
                    type="time"
                    value={formData.horarioCierre}
                    onChange={handleChange}
                  />
                </div>
              </HorariosContainer>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button type="button" $variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" $variant="primary">
              Guardar
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  )
}
