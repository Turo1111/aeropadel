
"use client"
import { useSession } from "next-auth/react"

export default function Inicio() {

  const { data: session }: { data: any }	 = useSession()
  console.log("Session:", session)
  return (
    <div>
      <h1>Inicio</h1>
      <p>{session?.user?.nickname}</p>
    </div>
  )
}