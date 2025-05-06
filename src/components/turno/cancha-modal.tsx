"use client"

import type React from "react"

import { useState } from "react"
import styled from "styled-components"
import { FaTimes } from "react-icons/fa"

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

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #94a3b8;
    box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.2);
  }
`

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`

const Checkbox = styled.input`
  margin-right: 8px;
`

const CheckboxLabel = styled.label`
  font-size: 14px;
  cursor: pointer;
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

interface CanchaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (canchaData: Omit<Cancha, "_id" | "localId">) => void
}

export default function CanchaModal({ isOpen, onClose, onSave }: CanchaModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "pasto_sintetico",
    cubierta: false,
    iluminacion: false,
    activa: true,
  })
  const [errors, setErrors] = useState({
    nombre: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear errors when typing
    if (name === "nombre") {
      setErrors({
        ...errors,
        nombre: "",
      })
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { nombre: "" }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
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

    const canchaData: Omit<Cancha, "_id" | "localId"> = {
      nombre: formData.nombre,
      tipo: formData.tipo as "pasto_sintetico" | "cemento" | "alfombra",
      cubierta: formData.cubierta,
      iluminacion: formData.iluminacion,
      activa: formData.activa,
    }

    onSave(canchaData)

    // Reset form
    setFormData({
      nombre: "",
      tipo: "pasto_sintetico",
      cubierta: false,
      iluminacion: false,
      activa: true,
    })
  }

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>Nueva Cancha</ModalTitle>
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
                placeholder="Ingrese el nombre de la cancha"
              />
              {errors.nombre && <ErrorMessage>{errors.nombre}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="tipo">Tipo de superficie</Label>
              <Select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="pasto_sintetico">Pasto Sintético</option>
                <option value="cemento">Cemento</option>
                <option value="alfombra">Alfombra</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <CheckboxContainer>
                <Checkbox
                  id="cubierta"
                  name="cubierta"
                  type="checkbox"
                  checked={formData.cubierta}
                  onChange={handleCheckboxChange}
                />
                <CheckboxLabel htmlFor="cubierta">Cancha cubierta</CheckboxLabel>
              </CheckboxContainer>
            </FormGroup>

            <FormGroup>
              <CheckboxContainer>
                <Checkbox
                  id="iluminacion"
                  name="iluminacion"
                  type="checkbox"
                  checked={formData.iluminacion}
                  onChange={handleCheckboxChange}
                />
                <CheckboxLabel htmlFor="iluminacion">Con iluminación</CheckboxLabel>
              </CheckboxContainer>
            </FormGroup>

            <FormGroup>
              <CheckboxContainer>
                <Checkbox
                  id="activa"
                  name="activa"
                  type="checkbox"
                  checked={formData.activa}
                  onChange={handleCheckboxChange}
                />
                <CheckboxLabel htmlFor="activa">Cancha activa</CheckboxLabel>
              </CheckboxContainer>
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
