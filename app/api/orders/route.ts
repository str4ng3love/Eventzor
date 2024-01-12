import { prisma } from "@/lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if (!session)
    return NextResponse.json({ error: "not authorized." }, { status: 401 });
  if (req.method === "POST") {
    const body = await req.json();
    let order = body.order;
    let items = order.items.filter(
      (i: { type: string }) => i.type === "market"
    );
    let events = order.items.filter(
      (i: { type: string }) => i.type === "event"
    );
    if (items.length > 0 && order.shippingData.address.length === 0) {
      return NextResponse.json({ error: "Please provide an address." });
    }

    let amounts = items.concat(events)
   


  
    try {
        const newOrder = await prisma.order.create({
          data: {
            currency: order.currency.name,
            amounts: amounts,
            buyerName: session.user?.name ? session.user?.name : "",
            phoneNumber: order.shippingData.name,
            shippingAddress: order.shippingData.address,
            status: "pendingPayment",
          },
        });

      return NextResponse.json({ message: "Order created.", id: newOrder.id });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: "Could not create order." });
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
export { handler as POST };
