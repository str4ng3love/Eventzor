'use client'

import { IType } from "@/types/enums"
import { useState } from "react"
import SpinnerMini from "../static/SpinnerMini"
import { useRouter } from "next/navigation"
import { FormatString } from "@/helpers/FormatString"
import CommentInPortal from "./Comment/CommentInPortal"


interface Props {
    user: string
    type: IType
    stats: { amount: number, name: string }
}
const StatsDisplay = ({ user, type, stats }: Props) => {
    const [elements, setElements] = useState<{ title?: string, item?: string, message?: string, id?: string }[] | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [id, setId] = useState<string | null>(null)
    const router = useRouter()
    const getElements = async (type: string, user: string) => {
        try {
            const resp = await fetch(`/api/${type}/user/${user}`)
            const data = await resp.json()

            if (data.error) {
                console.log(data.error)
            } else {
                if (type === IType.events) {
                    return data.events

                } else if (type === IType.items) {
                    return data.items
                } else {
                    return data.comments
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {stats.amount === 0 ?
                <span onClick={async () => {

                    return
                }} className={`${stats.amount > 0 ? "cursor-pointer hover:bg-link duration-300 transition-all" : ""} p-1 min-w-full inline-block `}>{stats.amount}&nbsp;{stats.name}</span>
                :
                <span onClick={async () => {
               
                    setIsOpen(!isOpen)
                    if (elements === null) { setElements(await getElements(type, user)) } else {
                        return
                    }
                }} className={`cursor-pointer hover:bg-link duration-300 transition-all p-1 min-w-full inline-block `}>{stats.amount}&nbsp;{stats.name}</span>}
            <div className="flex flex-col mt-4">
                {isOpen && elements !== null && type === IType.events ? elements.map((e, i) =>
                    <span onClick={() => {
                        router.push(`/${type.slice(0, -1)}/${e.title}`)
                    }} className="cursor-pointer p-1 hover:bg-link duration-300 transition-all" key={i}>{e.title}</span>
                ) : <></>}
                {isOpen && elements !== null && type === IType.items ? elements.map((e, i) =>
                    <span onClick={() => {
                        router.push(`/${type.slice(0, -1)}/${e.item}`)
                    }} className="cursor-pointer p-1 hover:bg-link duration-300 transition-all" key={i}>{e.item}</span>
                ) : <></>}
                {isOpen && elements !== null && type === IType.comments ? elements.map((e, i) =>
                    <span onClick={() => {
                        setId(e.id as string)
                    }} className="cursor-pointer p-1 hover:bg-link duration-300 transition-all" key={i}>{FormatString(e.message as string)}</span>
                ) : <></>}
                {isOpen && elements === null ? <div className="flex items-center justify-center py-10">
                    <SpinnerMini />
                </div> : <></>}
            </div>
            {id ? <CommentInPortal id={id} cleanupFn={() => setId(null)} /> : <></>}
        </>
    )
}

export default StatsDisplay