"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import styled from "styled-components"
import { FaSearch, FaPlus, FaEdit, FaKey } from "react-icons/fa"
import UserModal from "../../../components/usuarios/user-modal"
import RoleModal from "../../../components/usuarios/role-modal"
import PermissionsPopover from "../../../components/usuarios/permissions-popover"
import { getLoading } from "@/redux/loadingSlice"
import { useSelector } from "react-redux"
import { io } from "socket.io-client"
import apiClient from "@/utils/client"
import { useAppDispatch } from "@/redux/hook"
import { setLoading } from "@/redux/loadingSlice"
import { Role, User } from "@/interfaces/auth.interface"
import ListUser from "@/components/usuarios/list-user"
import ListRoles from "@/components/usuarios/list-roles"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// Styled Components
const Container = styled.div`
  padding: 16px;
  
  @media (min-width: 768px) {
    padding: 24px;
  }
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
  width: 100%;
  
  @media (min-width: 768px) {
    max-width: 500px;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #94a3b8;
    box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.2);
  }
`

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  color: #94a3b8;
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  
  @media (min-width: 768px) {
    width: auto;
  }
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
  flex: 1;
  
  @media (min-width: 768px) {
    flex: initial;
  }

  &:hover {
    background-color: #1e293b;
  }
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  
  background-color: ${(props) => (props.$active ? "#3b82f6" : "#f1f5f9")};
  color: ${(props) => (props.$active ? "white" : "#64748b")};
  border: none;
  
  &:hover {
    background-color: ${(props) => (props.$active ? "#2563eb" : "#e2e8f0")};
  }
`
const TabContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 8px;
  padding-bottom: 8px;
  margin-bottom: 16px;
  
  /* Hide scrollbar but keep functionality */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`

export default function UsuariosPage() {

  const [search, setSearch] = useState<string>('')
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [permissionsPopover, setPermissionsPopover] = useState<{ roleId: string; anchorEl: HTMLElement | null }>({
    roleId: "",
    anchorEl: null,
  })
  const [isListUser, setIsListUser] = useState(true)
  const { data: session } = useSession();
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const router = useRouter()

  const handleOpenPermissionsPopover = (roleId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setPermissionsPopover({
      roleId,
      anchorEl: event.currentTarget,
    })
  }

  const handleClosePermissionsPopover = () => {
    setPermissionsPopover({
      roleId: "",
      anchorEl: null,
    })
  }

  const handleOpenUserModal = (user?: User) => {
    if (user) {
      setCurrentUser(user)
      setIsUserModalOpen(true)
    } else {
      setCurrentUser(null)
    }
  }

  useEffect(() => {
    if (session?.user?.role?.permissions) {
      const hasUserPermission = session.user.role.permissions.includes("read_user");
      const hasRolePermission = session.user.role.permissions.includes("read_role");
      
      if (!hasUserPermission && !hasRolePermission) {
        router.push('/dashboard/inicio');
        return;
      }

      // Set initial tab based on permissions
      if (hasUserPermission && !hasRolePermission) {
        setIsListUser(true);
      } else if (!hasUserPermission && hasRolePermission) {
        setIsListUser(false);
      }
    }
  }, [session]);
  

  return (
    <Container>
      <Title>Gestión de Usuarios</Title>

      <Header>
        <SearchContainer>
          <SearchIcon>
            <FaSearch size={14} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar usuarios por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchContainer>

        <ButtonsContainer>
          {session?.user?.role?.permissions?.includes("create_user") && (
            <Button onClick={() => {setIsUserModalOpen(true); setCurrentUser(null)}}>
              <FaPlus size={14} />
              Nuevo usuario
            </Button>
          )}
          {session?.user?.role?.permissions?.includes("create_role") && (
            <Button onClick={() => {setIsRoleModalOpen(true); setCurrentRole(null)}}>
              <FaPlus size={14} />
              Nuevo rol
            </Button>
          )}
        </ButtonsContainer>
      </Header>
      

      <TabContainer>
          <Tab $active={isListUser} onClick={() => setIsListUser(true)}>
            Usuarios
          </Tab>
          <Tab $active={!isListUser} onClick={() => setIsListUser(false)}>
            Roles
          </Tab>
      </TabContainer>

      {isListUser ? (
        <ListUser search={search} setSearch={() => setSearch(prevData=>'')} handleOpenUserModal={handleOpenUserModal} handleOpenPermissionsPopover={handleOpenPermissionsPopover} />
      ) : (
        <ListRoles search={search} setSearch={() => setSearch(prevData => '')} handleOpenRoleModal={(role)=>{setIsRoleModalOpen(true); setCurrentRole(role)}} handleOpenPermissionsPopover={handleOpenPermissionsPopover} />
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          user={currentUser}
        />
      )}

      {/* Role Modal */}
      {isRoleModalOpen && (
        <RoleModal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)}
          role={currentRole}
        />
      )}

      {/* Permissions Popover */}
      {permissionsPopover.anchorEl && (
        <PermissionsPopover
          anchorEl={permissionsPopover.anchorEl}
          onClose={handleClosePermissionsPopover}
          roleId={permissionsPopover.roleId}
        />
      )}
      
    </Container>
  )
}
