'use client'

import Currency from "../Currency"
import Logout from "../Logout"
import ShoppingCart from "../ShoppingCart/ShoppingCart"
import UserMenu from "../UserMenu"
import Search from "./Search"
import { useEffect, useRef, useState } from "react"

const BurgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false)
    const refEl = useRef<HTMLHtmlElement | null>()
    useEffect(() => {
        const doc = document.querySelector("html")
        refEl.current = doc

    }, [])
    useEffect(() => {
        if (isOpen) {
            refEl.current?.classList.add('overflow-hidden')
            refEl.current?.classList.add('pr-0')
        } else {
            refEl.current?.classList.remove('overflow-hidden')
            refEl.current?.classList.remove('pr-0')
        }
    }, [isOpen])
    useEffect(() => {
        window.addEventListener("closeBurger", () => {setIsOpen(false)})

        return () => window.removeEventListener("closeBurger", () => { })
    }, [])
    return (<>
        <button className={`group flex md:hidden z-10 flex-col items-center justify-center gap-1 p-2 rounded-md ${isOpen ? 'bg-white' : ""}`} onClick={() => setIsOpen(!isOpen)}>
            <span aria-hidden className={`transition-all duration-300 h-1 w-6  ${isOpen ? "-rotate-45 translate-y-2 bg-black group-hover:bg-text_inactive" : "rotate-0 bg-text_inactive group-hover:bg-white"}`}></span>
            <span aria-hidden className={`transition-all duration-300 h-1 w-6  ${isOpen ? "bg-black group-hover:bg-text_inactive" : "bg-text_inactive group-hover:bg-white"} `}></span>
            <span aria-hidden className={`transition-all duration-300 h-1 w-6  ${isOpen ? "rotate-45 -translate-y-2 bg-black group-hover:bg-text_inactive" : "rotate-0 bg-text_inactive group-hover:bg-white"}`}></span>
        </button>
        {isOpen ?


            <div onKeyDown={(e) => { }} className="flex md:flex-row md:hidden bg-gradient-to-tr from-primary via-bg to-slate-900 items-center md:justify-start md:gap-4 gap-8 md:relative absolute left-0 h-screen inset-0 flex-col  md:bg-transparent justify-center overflow-hidden">
                <Search />
                <Currency />
                <UserMenu />
            </div>



            :
            null}
    </>
    )
}


export default BurgerMenu