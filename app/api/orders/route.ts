import { prisma } from "@/lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { CartOrder, OrdersParsedAmounts } from "@/types/interfaces";
import { triggerNotification } from "@/helpers/eventEmitter";
import { revalidatePath } from "next/cache";
import { ObjectId } from "bson";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if (!session)
    return NextResponse.json({ error: "not authorized." }, { status: 401 });
  if (req.method === "POST") {
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
    let error = false
    events.map(e => {
      if (ObjectId.isValid(e.id)) {
        e
      } else {
        error = true
      }
    })

    items.map(i => {
      if (ObjectId.isValid(i.id)) {
        i
      } else {
        error = true
      }
    })
    if (error) {
      return NextResponse.json({ error: `One or more of requested items has an incorrect ID` })
    }
    const [eventsDB, itemsDB] = await prisma.$transaction(async (tx) => {
      const eventsDB = await Promise.all(events.map(async (e) => await tx.event.findUnique({ where: { id: e.id }, select: { id: true, tickets: true, ticketsSold: true } })))
      const itemsDB = await Promise.all(items.map(async (i) => await tx.marketItem.findUnique({ where: { id: i.id }, select: { id: true, amount: true, amountSold: true } })))
      return [eventsDB, itemsDB]
    })

    const eventsDBSorted = eventsDB.sort((a, b) => a!.id.localeCompare(b!.id))
    const itemsDBSorted = itemsDB.sort((a, b) => a!.id.localeCompare(b!.id))
    const eventsSorted = events.sort((a, b) => a.id.localeCompare(b.id))
    const itemsSorted = items.sort((a, b) => a.id.localeCompare(b.id))
    let eventsViability = { items: [''], overStock: false, notFound: false }
    let itemsViability = { items: [''], overStock: false, notFound: false }


    eventsSorted.map((e, index) => {

      if (eventsDBSorted[index] === null) {
        eventsViability = { items: [...eventsViability.items, e.item], overStock: eventsViability.overStock, notFound: true }
      } else if (e.amount > eventsDBSorted[index]!.tickets || e.amount + eventsDBSorted[index]!.ticketsSold > eventsDBSorted[index]!.tickets) {
        eventsViability = { items: [...eventsViability.items, e.item], overStock: true, notFound: eventsViability.notFound }
      }
    })
    itemsSorted.map((i, index) => {

      if (itemsDBSorted[index] === null) {
        itemsViability = { items: [...itemsViability.items, i.item], overStock: itemsViability.overStock, notFound: true }
      } else if (i.amount > itemsDBSorted[index]!.amount || i.amount + itemsDBSorted[index]!.amountSold > itemsDBSorted[index]!.amount) {
        itemsViability = { items: [...itemsViability.items, i.item], notFound: itemsViability.notFound, overStock: true }
      }
    })
    if (eventsViability.notFound) {
      return NextResponse.json({ error: `One of requested items not found` })
    }
    if (itemsViability.notFound) {
      return NextResponse.json({ error: `One of requested items not found` })
    }
    if (eventsViability.overStock === true) {
      return NextResponse.json({ error: `There's not enough requested items : "${eventsViability.items.filter(i => i.length > 0).map((i, index) => `${index === 0 ? "" : " "}` + i.replace(",", " "))}" tickets` })
    }
    if (itemsViability.overStock === true) {

      return NextResponse.json({ error: `There's not enough requested items : "${itemsViability.items.filter(i => i.length > 0).map((i, index) => `${index === 0 ? "" : " "}` + i.replace(",", " "))}"` })
    }
    // hacky way to coerce prisma into accepting `amounts` var


    let amounts: any = items.concat(events)

    try {
      const order = await prisma.$transaction(async (tx) => {


        const order = await tx.order.create({
          data: {
            currency: body.order.currency.name,
            amounts: amounts,
            buyerName: session.user?.name ? session.user?.name : "",
            phoneNumber: body.order.shippingData.name,
            shippingAddress: body.order.shippingData.address,
            status: "pendingPayment",
          }, select: { amounts: true, id: true }
        });

        await Promise.all(eventsSorted.map((e, index) => tx.event.update({ where: { id: e.id }, data: { ticketsSold: eventsDBSorted[index]!.ticketsSold + e.amount } })))
        await Promise.all(itemsSorted.map((i, index) => tx.marketItem.update({ where: { id: i.id }, data: { amountSold: itemsDBSorted[index]!.amountSold + i.amount } })))
        const amountsParsed: OrdersParsedAmounts[] = order.amounts.map(a => JSON.parse(JSON.stringify(a)))

        const orderIds = amountsParsed.map(a => a.id)


        const recipients = await Promise.all(orderIds.map(async i => await tx.user.findFirst({ where: { OR: [{ events: { some: { id: i } } }, { marketItems: { some: { id: i } } }] }, select: { name: true } })))
        const recipientsReduced = [...new Set(recipients.map(r => r?.name))]

        triggerNotification(recipientsReduced)
        await Promise.all(recipientsReduced.map(async r => r === undefined ? null : await tx.notification.create({ data: { action: "status", orderId: order.id, initiator: session.user?.name as string, recipient: r } })))

        return order
      })

      items.map(i => revalidatePath(`/item/${i.item}`))
      events.map(e => revalidatePath(`/event/${e.item}`))

      // SSE Broadcast
      return NextResponse.json({ message: "Order created.", id: order.id });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: "Could not create order." });
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
export { handler as POST };
