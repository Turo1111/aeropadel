"use client"
import { useSession } from "next-auth/react"
import Image from "next/image"
import styled from "styled-components"
import { FaShoppingCart, FaUsers, FaBox, FaChartBar } from "react-icons/fa"
import Link from "next/link"

export default function Inicio() {
  const { data: session }: { data: any } = useSession()

  const windows = [
    {
      name: "Ventas",
      icon: <FaShoppingCart size={24} />,
      path: "/dashboard/venta",
      permission: "read_sale"
    },
    {
      name: "Usuarios",
      icon: <FaUsers size={24} />,
      path: "/dashboard/usuarios",
      permission: "read_user"
    },
    {
      name: "Productos",
      icon: <FaBox size={24} />,
      path: "/dashboard/producto",
      permission: "read_product"
    }
  ]

  return (
    <Container>
      <WelcomeSection>
        <LogoContainer>
          <Image 
            src="/LOGO2.png" 
            alt="AeroPadel Logo" 
            width={300} 
            height={100}
            priority
          />
        </LogoContainer>
        <WelcomeText>
          Bienvenido a AeroPadel, {session?.user?.nickname}
        </WelcomeText>
      </WelcomeSection>

      <WindowsGrid>
        {windows.map((window) => {
          // Check if user has permission for this window
          const hasPermission = session?.user?.role?.permissions?.includes(window.permission)
          if (!hasPermission) return null

          return (
            <WindowCard key={window.name} href={window.path}>
              <IconContainer>
                {window.icon}
              </IconContainer>
              <WindowName>{window.name}</WindowName>
            </WindowCard>
          )
        })}
      </WindowsGrid>
    </Container>
  )
}

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`

const WelcomeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;
`

const LogoContainer = styled.div`
  margin-bottom: 24px;
`

const WelcomeText = styled.h1`
  font-size: 24px;
  color: #1e293b;
  text-align: center;
  margin: 0;
`

const WindowsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  padding: 0 16px;
`

const WindowCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`

const IconContainer = styled.div`
  color: #0f172a;
  margin-bottom: 16px;
`

const WindowName = styled.h2`
  font-size: 18px;
  color: #1e293b;
  margin: 0;
  text-align: center;
`