"use client"
import Button from "./Button"
import { signOut } from "next-auth/react"

const Logout = () => {
  return (
    <Button title="Log out" fn={()=>signOut()} text="Log out"/>
  )
}

export default Logout