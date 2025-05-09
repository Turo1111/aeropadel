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

// Interfaces
interface Role {
  _id: string
  name: string
  description?: string
  permissions: string[]
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
  max-width: 700px;
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

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #94a3b8;
    box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.2);
  }
`

const PermissionsTable = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  margin-top: 16px;
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px;
  font-weight: 600;
  font-size: 14px;
  color: #64748b;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  border-bottom: 1px solid #e5e7eb;
  padding: 12px;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:nth-child(even) {
    background-color: #f8fafc;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const EntityName = styled.div`
  font-weight: 500;
`

const CheckboxCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Checkbox = styled.input`
  cursor: pointer;
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

// Entities and actions for permissions
const entities = [
  { id: "user", name: "Usuarios" },
  { id: "role", name: "Roles" },
  { id: "product", name: "Productos" },
  { id: "sale", name: "Ventas" },
  { id: "turno", name: "Turnos" },
  { id: "provider", name: "Proveedores" },
  { id: "brand", name: "Marcas" },
  { id: "category", name: "Categorías" },
]

const actions = [
  { id: "create", name: "Crear" },
  { id: "read", name: "Visualizar" },
  { id: "update", name: "Modificar" },
  { id: "delete", name: "Borrar" },
]

interface RoleModalProps {
  isOpen: boolean
  onClose: () => void
  role: Role | null
}

const initialValues: Partial<Role> = {
  name: '',
  description: '',
  permissions: [],
  isActive: true
}

export default function RoleModal({ isOpen, onClose, role }: RoleModalProps) {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: initialValues as Role,
    onSubmit: (formValue: Role) => {
      if (formValue.name === '') {
        dispatch(setAlert({
          message: 'El nombre del rol es obligatorio',
          type: 'error'
        }))
        return
      }

      dispatch(setLoading(true))
      const endpoint = role ? `/role/${role._id}` : '/role'
      const method = role ? 'patch' : 'post'

      apiClient[method](endpoint, formValue)
      .then(async (r) => {
        dispatch(setLoading(false))
        dispatch(setAlert({
          message: role ? 'Rol actualizado correctamente' : 'Rol creado correctamente',
          type: 'success'
        }))
        formik.resetForm()
        onClose()
      })
      .catch((e) => {
        dispatch(setLoading(false))
        dispatch(setAlert({
          message: `${e.response?.data?.error || 'Error al procesar la solicitud'}`,
          type: 'error'
        }))
      })
    }
  })

  useEffect(() => {
    if (role) {
      formik.setValues({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions,
        isActive: role.isActive
      } as Role)
    } else {
      formik.setValues(initialValues as Role)
    }
  }, [role])

  const handlePermissionChange = (entity: string, action: string, checked: boolean) => {
    const permission = `${action}_${entity}`
    const currentPermissions = formik.values.permissions || []

    if (checked) {
      formik.setFieldValue('permissions', [...currentPermissions, permission])
    } else {
      formik.setFieldValue('permissions', currentPermissions.filter((p) => p !== permission))
    }
  }

  const isPermissionChecked = (entity: string, action: string) => {
    return (formik.values.permissions || []).includes(`${action}_${entity}`)
  }

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader>
            <ModalTitle>{role ? "Editar Rol" : "Nuevo Rol"}</ModalTitle>
            <CloseButton type="button" onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            <Input 
              label="Nombre del Rol *" 
              name="name" 
              value={formik.values.name} 
              onChange={formik.handleChange} 
              type="text" 
              required={true} 
            />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#64748b' }}>
                Descripción
              </label>
              <Textarea
                name="description"
                value={formik.values.description || ''}
                onChange={formik.handleChange}
                placeholder="Ingrese una descripción para el rol"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#64748b' }}>
                Permisos
              </label>
              <PermissionsTable>
                <TableHeader>
                  <div>Entidad</div>
                  {actions.map((action) => (
                    <div key={action.id} style={{ textAlign: "center" }}>
                      {action.name}
                    </div>
                  ))}
                </TableHeader>

                {entities.map((entity) => (
                  <TableRow key={entity.id}>
                    <EntityName>{entity.name}</EntityName>
                    {actions.map((action) => (
                      <CheckboxCell key={`${entity.id}-${action.id}`}>
                        <Checkbox
                          type="checkbox"
                          checked={isPermissionChecked(entity.id, action.id)}
                          onChange={(e) => handlePermissionChange(entity.id, action.id, e.target.checked)}
                        />
                      </CheckboxCell>
                    ))}
                  </TableRow>
                ))}
              </PermissionsTable>
            </div>
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
