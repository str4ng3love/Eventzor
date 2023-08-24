'use client'

import { signOut } from "next-auth/react"
import Button from "../Button"


const SingOut = () => {
  return (
    <Button text="logout" fn={()=>signOut()}/>
  )
}

export default SingOut