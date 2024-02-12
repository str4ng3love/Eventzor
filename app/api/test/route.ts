
import { prisma } from "@/lib/ConnectPrisma";
import { CartOrder } from "@/types/interfaces";
import { NextResponse } from "next/server"





async function handler(req: Request) {

    const body = await req.json();

    let items: CartOrder[] = body.order.items.filter(
        (i: { type: string }) => i.type === "market"
    );
    let events: CartOrder[] = body.order.items.filter(
        (i: { type: string }) => i.type === "event"
    );
    if (items.length > 0 && body.order.shippingData.address.length === 0) {
        return NextResponse.json({ error: "Please provide an address." });
    }

    const [eventsDB, itemsDB] = await prisma.$transaction(async (tx) => {
        const eventsDB = await Promise.all(events.map(async (e) => await tx.event.findUnique({ where: { id: e.id }, select: { id: true, tickets: true, ticketsSold: true } })))
        const itemsDB = await Promise.all(items.map(async (i) => await tx.marketItem.findUnique({ where: { id: i.id }, select: { id: true, amount: true, amountSold: true } })))
        return [eventsDB, itemsDB]
    })

    const eventsDBSorted = eventsDB.sort((a, b) => a!.id.localeCompare(b!.id))
    const itemsDBSorted = itemsDB.sort((a, b) => a!.id.localeCompare(b!.id))

    let eventsViability = { items: [''], viable: true }
    let itemsViability = { items: [''], viable: true }

    events.sort((a, b) => a.id.localeCompare(b.id)).map((e, index) => {
        if (eventsDBSorted[index] === null) {

            return NextResponse.json({ error: `Items specified not found: ${e.item} tickets` })
        } else if (e.amount > eventsDBSorted[index]!.tickets || e.amount + eventsDBSorted[index]!.ticketsSold > eventsDBSorted[index]!.tickets) {
            eventsViability = { items: [...eventsViability.items, e.item], viable: false }

        }
    })
    items.sort((a, b) => a.id.localeCompare(b.id)).map((i, index) => {

        if (itemsDBSorted[index] === null) {
            return NextResponse.json({ error: `Items specified not found: ${i.item}` })
        } else if (i.amount > itemsDBSorted[index]!.amount || i.amount + itemsDBSorted[index]!.amountSold > itemsDBSorted[index]!.amount) {
            itemsViability = { items: [...itemsViability.items, i.item], viable: false }
        }
    })
    if (eventsViability.viable === false) {
        return NextResponse.json({ error: `There's not enough requested items : ${eventsViability.items.filter(i=> i.length > 0).map(i =>i.replace(",", " ") )} tickets` })
    }
    if (itemsViability.viable === false) {
  
        return NextResponse.json({ error: `There's not enough requested items : ${itemsViability.items.filter(i=> i.length > 0).map(i =>i.replace(",", " ") )}` })
    }
    let amounts = items.concat(events)

    return NextResponse.json({ message: "ok" })

}

export { handler as POST }