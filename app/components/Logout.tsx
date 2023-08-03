"use client"
import Button from "./Button"
import { signOut } from "next-auth/react"

const Logout = () => {
  return (
    <Button fn={()=>signOut()} text="Logout"/>
  )
}

export default Logout