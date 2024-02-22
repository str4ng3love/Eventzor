'use client'

import Currency from "../Currency"
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
        window.addEventListener("closeBurger", () => { setIsOpen(false) })

        return () => window.removeEventListener("closeBurger", () => { })
    }, [])
    return (<>
        <button aria-label="Burger Menu for smaller screens" className={`transition-all duration-150 group flex md:hidden z-10 flex-col items-center justify-center gap-1 p-2 rounded-md ${isOpen ? 'bg-interactive hover:bg-white' : ""}`} onClick={() => setIsOpen(!isOpen)}>
            <span aria-hidden className={`transition-all duration-150 h-1 w-6 ${isOpen ? "bg-black -rotate-45 translate-y-2" : "rotate-0  group-hover:bg-white bg-interactive"}`}></span>
            <span aria-hidden className={`transition-all duration-150 h-1 w-6 ${isOpen ? "bg-black " : "group-hover:bg-white bg-interactive"} `}></span>
            <span aria-hidden className={`transition-all duration-150 h-1 w-6 ${isOpen ? "bg-black rotate-45 -translate-y-2" : "rotate-0  group-hover:bg-white bg-interactive"}`}></span>
        </button>
        {isOpen ?


            <div onKeyDown={(e) => { }} className="flex md:hidden bg-sidebar dark:bg-primary items-center md:justify-start absolute left-0 h-screen inset-0 flex-col justify-center overflow-hidden gap-4">

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