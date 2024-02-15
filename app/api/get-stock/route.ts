import { prisma } from "@/lib/ConnectPrisma"
import { getServerSession } from "next-auth"
import { options } from "../auth/[...nextauth]/options"
import { NextResponse } from "next/server"

async function handler(req: Request) {
    const session = await getServerSession(options)
    if (!session?.user?.name) {
        return NextResponse.json({ error: 'You have to be authenticated' })
    }
    const [lowItemStocks, lowTicketStocks] = await prisma.$transaction(async (tx) => {
        const items = await tx.marketItem.findMany({ where: { merchantName: session?.user?.name as string }, orderBy: { id: "asc" }, select: { id: true, item: true, amount: true, amountSold: true } })

        const lowItemStocks = items.filter((i) => {

            console.log(`${i.amount} / (${i.amount}+${i.amountSold} * 100) = ${(i.amount / (i.amount + i.amountSold)) * 100}` )
            console.log(((i.amount / (i.amount + i.amountSold)) * 100).toFixed(2))
            if (((i.amount / (i.amount + i.amountSold)) * 100) <= 10) {
                return i
            }
        })
        const events = await tx.event.findMany({ where: { organizerName: session?.user?.name as string }, orderBy: { id: "asc" }, select: { id: true, title: true, tickets: true, ticketsSold: true } })

        const lowTicketStocks = events.filter((i) => {
            if (((i.tickets / (i.tickets + i.ticketsSold)) * 100) <= 10) {
                i
            }
        })
        return [lowItemStocks, lowTicketStocks]
    })
    console.log(lowItemStocks, lowTicketStocks)
    return NextResponse.json({ lowItemStocks, lowTicketStocks })
}



export { handler as GET }