import { prisma } from "@/lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { ParsedOrder } from "@/types/interfaces";
import { TriggerNotification } from "@/helpers/EventEmitter";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if (!session)
    return NextResponse.json({ error: "not authorized." }, { status: 401 });
  if (req.method === "POST") {
    const body = await req.json();
    let items = body.order.items.filter(
      (i: { type: string }) => i.type === "market"
    );
    let events = body.order.items.filter(
      (i: { type: string }) => i.type === "event"
    );
    if (items.length > 0 && body.order.shippingData.address.length === 0) {
      return NextResponse.json({ error: "Please provide an address." });
    }

    let amounts = items.concat(events)




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
        const amountsParsed: ParsedOrder[] = order.amounts.map(a => JSON.parse(JSON.stringify(a)))

        const orderIds = amountsParsed.map(a => a.id)


        const recipients = [...new Set(await Promise.all(orderIds.map(async i => await tx.user.findFirst({ where: { OR: [{ events: { some: { id: i } } }, { marketItems: { some: { id: i } } }] }, select: { name: true } }))))]
       
        TriggerNotification([...recipients.map(r=>r?.name)])
        await Promise.all(recipients.map(async r => r === null ? null : await tx.notification.create({ data: { action: "status", orderId: order.id, initiator: session.user?.name as string, recipient: r.name } })))
        return order
      })

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
