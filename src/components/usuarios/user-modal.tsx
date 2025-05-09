"use client"

import type React from "react"
import { useEffect } from "react"
import styled from "styled-components"
import { FaTimes } from "react-icons/fa"
import { useFormik } from 'formik'
import { setAlert } from "@/redux/alertSlice"
import { useAppDispatch } from "@/redux/hook"
import { setLoading } from "@/redux/loadingSlice"
import apiClient from "@/utils/client"
import Input from '../Input'
import InputSelect from "../InputSelect"
import { User } from "@/interfaces/auth.interface"

interface UserResponse {
  _id: string
  nickname: string
  email?: string
  password: string
  role: string
  nameRole: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
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
  
  background-color: ${(props) => (props.$variant === "primary" ? "#0f172a" : "#f1f5f9")};
  color: ${(props) => (props.$variant === "primary" ? "white" : "#64748b")};
  border: none;
  
  &:hover {
    background-color: ${(props) => (props.$variant === "primary" ? "#1e293b" : "#e2e8f0")};
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

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

const initialValues: Partial<User> = {
  nickname: '',
  password: '',
  role: undefined,
  isActive: true,
  nameRole: ''
}

export default function UserModal({ isOpen, onClose, user }: UserModalProps) {

  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: initialValues as User,
    onSubmit: (formValue: User) => {

      dispatch(setLoading(true))
      if (formValue.nickname === '' || (!user && formValue.password === '')) {
        dispatch(setAlert({
          message: 'Falta nickname o contraseña',
          type: 'error'
        }))
        return
      }

      if (formValue.role === '' || formValue.nameRole === '') {
        dispatch(setAlert({
          message: 'Falta seleccionar un rol',
          type: 'error'
        }))
        return
      }

      const endpoint = user ? `/user/${user._id}` : '/auth/register'
      const method = user ? 'patch' : 'post'

      apiClient[method](endpoint, formValue)
      .then(async (r) => {
        dispatch(setLoading(false))
        dispatch(setAlert({
          message: user ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente',
          type: 'success'
        }))
        formik.resetForm()
        onClose()
      })
      .catch((e) => {
        dispatch(setLoading(false))
        dispatch(setAlert({
          message: `Error: ${e.response?.data?.error || 'Error al procesar la solicitud'}`,
          type: 'error'
        }))
      })
    }
  })

  useEffect(() => {
    if (user) {
      formik.setValues({
        nickname: user.nickname,
        password: '',
        role: undefined,
        isActive: user.isActive,
        nameRole: user.nameRole
      } as unknown as User)
    } else {
      formik.setValues(initialValues as User)
    }
  }, [user])

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader>
            <ModalTitle>{user ? "Editar usuario" : "Nuevo usuario"}</ModalTitle>
            <CloseButton type="button" onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            <Input 
              label="Nombre" 
              name="nickname" 
              value={formik.values.nickname} 
              onChange={formik.handleChange} 
              type="text" 
              required={true} 
            />
            
            <Input 
              label={user ? "Contraseña (dejar en blanco para mantener)" : "Contraseña *"} 
              name="password" 
              value={formik.values.password} 
              onChange={formik.handleChange} 
              type="password" 
              required={!user}
            />
            <InputSelect
              name={'nameRole'} 
              path={'role'} 
              label={'Rol'}
              value={formik.values.nameRole as string} 
              onChange={(id: string, item: {name: string}) => {
                formik.setFieldValue('role', id)
                formik.setFieldValue('nameRole', item.name)
              }}
            />

            <CheckboxContainer>
              <Checkbox
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formik.values.isActive}
                onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
              />
              <CheckboxLabel htmlFor="isActive">Usuario activo</CheckboxLabel>
            </CheckboxContainer>
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
