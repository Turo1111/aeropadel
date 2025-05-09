"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FaHome, FaShoppingCart, FaBox, FaShoppingBag, FaSignOutAlt, FaBars, FaTimes, FaTruck, FaTag, FaList, FaUsers, FaUserShield, FaCalendar } from "react-icons/fa"
import styled from "styled-components"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  position: relative;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const MobileHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #ffffff;

  @media (min-width: 768px) {
    display: none;
  }
`

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
`

const MobileLogo = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  font-weight: bold;
  font-size: 20px;
`

const MobileLogoText = styled.span`
  margin-left: 8px;
  font-size: 16px;
  color: #64748b;
`

const Sidebar = styled.aside<{ $collapsed: boolean; $mobileOpen: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: ${(props) => (props.$collapsed ? "90px" : "256px")};
  background-color: #f9f9fa;
  border-right: 1px solid #e5e7eb;
  transition: transform 0.3s ease, width 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  transform: ${(props) => (props.$mobileOpen ? "translateX(0)" : "translateX(-100%)")};

  @media (min-width: 768px) {
    position: relative;
    transform: translateX(0);
  }
`

const SidebarOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  display: ${(props) => (props.$show ? "block" : "none")};

  @media (min-width: 768px) {
    display: none;
  }
`

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
`

const LogoCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #0f172a;
  color: #ffffff;
  font-weight: bold;
  font-size: 20px;
`

const LogoText = styled.span`
  margin-top: 8px;
  font-size: 14px;
  color: #64748b;
`

const Navigation = styled.nav`
  flex: 1;
  padding: 0 16px;
  margin-top: 24px;
`

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const NavItemContainer = styled.li`
  list-style: none;
`

const NavLink = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  color: ${(props) => (props.$active ? "#0f172a" : "#1e293b")};
  background-color: ${(props) => (props.$active ? "rgba(15, 23, 42, 0.1)" : "transparent")};
  transition: background-color 0.2s, color 0.2s;
  text-decoration: none;

  &:hover {
    background-color: ${(props) => (props.$active ? "rgba(15, 23, 42, 0.1)" : "#f1f5f9")};
    color: #0f172a;
  }
`

const NavLabel = styled.span`
  margin-left: 12px;
`

const UserSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding: 16px;
`

const UserContainer = styled.div`
  display: flex;
  align-items: center;
`

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-weight: 500;
`

const UserInfo = styled.div`
  margin-left: 12px;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const UserName = styled.p`
  font-size: 14px;
  font-weight: 500;
`

const IconButton = styled.button`
  padding: 4px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;

  &:hover {
    background-color: #f1f5f9;
  }
`

const ToggleButton = styled.button`
  padding: 8px;
  margin: 16px;
  border-radius: 6px;
  background-color: rgba(15, 23, 42, 0.1);
  border: none;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: none;

  &:hover {
    background-color: rgba(15, 23, 42, 0.2);
  }

  @media (min-width: 768px) {
    display: block;
  }
`

const MainContent = styled.main`
  flex: 1;
  overflow: auto;
  background-color: #f8fafc;
  padding-top: 0;
  flex-direction: column;
  display: flex;
  @media (min-width: 768px) {
    padding-top: 0;
  }
`

const MobileCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;

  @media (min-width: 768px) {
    display: none;
  }
`

// Component interfaces
interface NavItemProps {
  icon: React.ReactNode
  label: string
  $collapsed: boolean
  $active: boolean
  href: string
  onClick?: () => void
}

// Components
function NavItem({ icon, label, $collapsed, $active, href, onClick }: NavItemProps) {
  return (
    <NavItemContainer>
      <NavLink href={href} $active={$active} onClick={onClick}>
        <span>{icon}</span>
        {!$collapsed && <NavLabel>{label}</NavLabel>}
      </NavLink>
    </NavItemContainer>
  )
}

export default function Dashboard({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Handle body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <Container suppressHydrationWarning={true}>
      {/* Mobile Header */}
      <MobileHeader>
        <MobileMenuButton onClick={() => setMobileOpen(true)}>
          <FaBars />
        </MobileMenuButton>
        <MobileLogo>
          <Image src="/LOGO2.png" alt="Logo" width={80} height={40} />
        </MobileLogo>
      </MobileHeader>

      {/* Sidebar Overlay */}
      <SidebarOverlay $show={mobileOpen} onClick={() => setMobileOpen(false)} />

      {/* Sidebar */}
      <Sidebar $collapsed={collapsed} $mobileOpen={mobileOpen}>
        <MobileCloseButton onClick={() => setMobileOpen(false)}>
          <FaTimes />
        </MobileCloseButton>
        {/* Logo */}
        <LogoContainer>
          <Image src="/LOGO2.png" alt="Logo" width={80} height={40} />
          {/* {!collapsed && <LogoText>demo</LogoText>} */}
        </LogoContainer>

        {/* Navigation */}
        <Navigation>
          <NavList>
            <NavItem
              icon={<FaHome size={18} />}
              label="Inicio"
              $collapsed={collapsed}
              $active={pathname === "/dashboard/inicio"}
              href="/dashboard/inicio"
              onClick={() => setMobileOpen(false)}
            />
            {session?.user?.role?.permissions?.includes("read_product") && (
              <NavItem
                icon={<FaBox size={18} />}
                label="Productos"
                $collapsed={collapsed}
                $active={pathname === "/dashboard/productos"}
                href="/dashboard/producto"
                onClick={() => setMobileOpen(false)}
              />
            )}
            {session?.user?.role?.permissions?.includes("read_user") && (
              <NavItem
                icon={<FaUsers size={18} />}
                label="Usuarios"
                $collapsed={collapsed}
                $active={pathname === "/dashboard/usuarios"}
                href="/dashboard/usuario"
                onClick={() => setMobileOpen(false)}
              />
            )}
            {session?.user?.role?.permissions?.includes("read_sale") && (
              <NavItem
                icon={<FaShoppingCart size={18} />}
                label="Ventas"
                $collapsed={collapsed}
                $active={pathname === "/dashboard/venta"}
                href="/dashboard/venta"
                onClick={() => setMobileOpen(false)}
              />
            )}
            {session?.user?.role?.permissions?.includes("read_turno") && (
              <NavItem
                icon={<FaCalendar size={18} />}
                label="Turnos"
                $collapsed={collapsed}
                $active={pathname === "/dashboard/turno"}
                href="/dashboard/turno"
                onClick={() => setMobileOpen(false)}
              />
            )}
          </NavList>
        </Navigation>

        {/* User Profile */}
        <UserSection>
          <UserContainer>
            <UserAvatar>{session?.user?.nickname?.charAt(0)}</UserAvatar>

            {!collapsed && (
              <UserInfo>
                <UserName>{session?.user?.nickname}</UserName>
                <IconButton  onClick={() => signOut()}>
                  <FaSignOutAlt size={16} />
                </IconButton>
              </UserInfo>
            )}

            {collapsed && (
              <IconButton style={{ marginLeft: "auto" }}  onClick={() => signOut()} >
                <FaSignOutAlt size={16}/>
              </IconButton>
            )}
          </UserContainer>
        </UserSection>

        {/* Toggle Button - Only visible on desktop */}
        <ToggleButton onClick={() => setCollapsed(!collapsed)}>{collapsed ? ">>" : "<<"}</ToggleButton>
      </Sidebar>

      {/* Main Content */}
      <MainContent>{children}</MainContent>
    </Container>
  )
}
