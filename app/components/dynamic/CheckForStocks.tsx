'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import SpinnerMini from "../static/SpinnerMini";
import Notification from "../static/Notification";

interface LowItemStocks { id: string, amount: number, amountSold: number, item: string }[];
interface LowTicketStocks { id: string, tickets: number, ticketsSold: number, title: string }[];


const CheckForStocks = () => {
    const [lowItemStocks, setLowItemStocks] = useState<LowItemStocks[]>()
    const [lowTicketStocks, setLowTicketStocks] = useState<LowTicketStocks[]>()
    const [notify, setNotify] = useState({ error: false, message: "", show: false })
    const checkStocks = async () => {
        try {
            const resp = await fetch('/api/get-stock')
            const data = await resp.json()
            if (data.error) {
                setNotify({ error: true, show: true, message: "" })
            } else {
                setLowItemStocks(data.lowItemStocks)
                setLowTicketStocks(data.lowTicketStocks)
            }
        } catch (error) {
            setNotify({ error: true, show: true, message: "Could not fetch data." })
            console.log(error)
        }
    }
    useEffect(() => {
        ( () => {
            checkStocks()
        })()
    }, [])
    if (lowItemStocks === undefined || lowTicketStocks === undefined) {
        return (<div className="w-full flex justify-center p-8"><SpinnerMini /></div>)
    }

    return (
        <>
            {lowItemStocks.length > 0 || lowTicketStocks.length > 0 ?
                <div className="flex flex-col gap-2 p-6">
                    <div className="flex flex-col bg-bg_interactive ring-2 ring-primary p-4">
                        <h2>Items stock below 10%</h2>
                        <div className="flex flex-col justify-start indent-1">
                            {lowItemStocks.length > 0 ? lowItemStocks.map(i =>
                                <Link className="p-1 hover:bg-link transition-all duration-150" href={`/item/${i.item}`}>{i.item}</Link>
                            ) : <span>None</span>}
                        </div>
                    </div>
                    <div className="flex flex-col bg-bg_interactive ring-2 ring-primary p-4">
                        <h2>Events with tickets below 10%</h2>
                        <div className="flex flex-col justify-start indent-1">
                            {lowTicketStocks.length > 0 ? lowTicketStocks.map(t =>
                                <Link className="p-1 hover:bg-link transition-all duration-150" href={`/event/${t.title}`}>{t.title}</Link>
                            ) : <span>None</span>}
                        </div>
                    </div>
                </div>
                :
                <div className="w-full flex items-center justify-center p-8">
                    <span>Nothing to report</span>
                </div>}
            {notify.show == true ? <Notification show={notify.show} error={notify.error} message={notify.message} onAnimEnd={() => setNotify({ show: false, error: false, message: "" })} /> : null}
        </>
    )
}

export default CheckForStocks