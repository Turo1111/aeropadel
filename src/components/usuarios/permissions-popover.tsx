"use client"

import { Role } from "@/interfaces/auth.interface"
import apiClient from "@/utils/client"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

// Styled Components
const PopoverContainer = styled.div`
  position: absolute;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 50;
`

const PopoverHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 14px;
  background-color: #f8fafc;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`

const PopoverBody = styled.div`
  padding: 12px 16px;
`

const PermissionCategory = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const CategoryTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  color: #0f172a;
  text-transform: capitalize;
`

const PermissionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const PermissionItem = styled.li`
  font-size: 13px;
  padding: 4px 0;
  color: #64748b;
  display: flex;
  align-items: center;
  
  &:before {
    content: "•";
    margin-right: 8px;
    color: #94a3b8;
  }
`

const NoPermissions = styled.div`
  padding: 12px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`

interface PermissionsPopoverProps {
  anchorEl: HTMLElement
  onClose: () => void
  roleId: string
}

// Helper function to format permission names
const formatPermission = (permission: string) => {
  const [action, entity] = permission.split("_")

  const actionMap: Record<string, string> = {
    create: "Crear",
    read: "Visualizar",
    update: "Modificar",
    delete: "Borrar",
  }

  const entityMap: Record<string, string> = {
    user: "usuarios",
    role: "roles",
    product: "productos",
    provider: "proveedores",
    brand: "marcas",
    category: "categorías",
  }

  return `${actionMap[action] || action} ${entityMap[entity] || entity}`
}

// Group permissions by entity
const groupPermissionsByEntity = (permissions: string[]) => {
  const groups: Record<string, string[]> = {}

  permissions.forEach((permission) => {
    const [action, entity] = permission.split("_")
    if (!groups[entity]) {
      groups[entity] = []
    }
    groups[entity].push(permission)
  })

  return groups
}

export default function PermissionsPopover({ anchorEl, onClose, roleId }: PermissionsPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [role, setRole] = useState<Role | null>(null)

  // Position the popover near the anchor element
  useEffect(() => {
    if (popoverRef.current && anchorEl) {
      const anchorRect = anchorEl.getBoundingClientRect()
      const popoverRect = popoverRef.current.getBoundingClientRect()

      // Position to the right of the anchor by default
      let left = anchorRect.right + 8
      let top = anchorRect.top

      // Check if popover would go off the right edge of the screen
      if (left + popoverRect.width > window.innerWidth) {
        // Position to the left of the anchor instead
        left = anchorRect.left - popoverRect.width - 8
      }

      // Check if popover would go off the bottom of the screen
      if (top + popoverRect.height > window.innerHeight) {
        // Adjust top position to fit within screen
        top = Math.max(8, window.innerHeight - popoverRect.height - 8)
      }

      popoverRef.current.style.left = `${left}px`
      popoverRef.current.style.top = `${top}px`
    }
  }, [anchorEl])

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl !== event.target &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [anchorEl, onClose])

  useEffect(() => {
    const fetchRole = async () => {
      const { data } = await apiClient.get(`/role/${roleId}`)
      console.log('response', data)
      setRole(data)
    }
    fetchRole()
  }, [roleId])

  const permissionGroups = groupPermissionsByEntity(role?.permissions || [])
  const hasPermissions = role ? role.permissions.length > 0 : false

  const entityNames: Record<string, string> = {
    user: "Usuarios",
    role: "Roles",
    product: "Productos",
    provider: "Proveedores",
    brand: "Marcas",
    category: "Categorías",
  }

  return (
    <PopoverContainer ref={popoverRef}>
      <PopoverHeader>Permisos</PopoverHeader>
      <PopoverBody>
        {hasPermissions ? (
          Object.entries(permissionGroups).map(([entity, permissions]) => (
            <PermissionCategory key={entity}>
              <CategoryTitle>{entityNames[entity] || entity}</CategoryTitle>
              <PermissionList>
                {permissions.map((permission) => (
                  <PermissionItem key={permission}>{formatPermission(permission)}</PermissionItem>
                ))}
              </PermissionList>
            </PermissionCategory>
          ))
        ) : (
          <NoPermissions>Este usuario no tiene permisos asignados</NoPermissions>
        )}
      </PopoverBody>
    </PopoverContainer>
  )
}
