'use client'

import Currency from "../Currency"
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
    return (<>
        <button className={`group flex md:hidden z-20 flex-col items-center justify-center gap-1 p-2 rounded-md`} onClick={() => setIsOpen(!isOpen)}>
            <span className={`transition-all duration-300 h-1 w-6 bg-text_inactive group-hover:bg-white ${isOpen ? "-rotate-45 translate-y-2" : "rotate-0"}`}></span>
            <span className={`transition-all duration-300 h-1 w-6 bg-text_inactive group-hover:bg-white`}></span>
            <span className={`transition-all duration-300 h-1 w-6 bg-text_inactive group-hover:bg-white ${isOpen ? "rotate-45 -translate-y-2" : "rotate-0"}`}></span>
        </button>
        {isOpen ?


        <div onKeyDown={(e)=>{}} className="flex md:flex-row items-center md:justify-start md:gap-4 gap-8 md:relative absolute left-0 h-screen inset-0 flex-col bg-black/   90 md:bg-transparent justify-center overflow-hidden">
                <Search />
                <Currency />
                <UserMenu />
                <ShoppingCart />
            </div>



            :
            null}
    </>
    )
}


export default BurgerMenu