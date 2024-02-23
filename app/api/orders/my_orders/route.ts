import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/ConnectPrisma";
import { revalidatePath } from "next/cache";
import { OrdersParsedAmounts } from "@/types/interfaces";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if (!session?.user?.name)
    return NextResponse.json({ error: "You have to be authorized" });
  if (req.method === "GET") {
    try {
      const orders = await prisma.order.findMany({
        where: {
          buyerName: session.user?.name ? session.user.name : "",
          status: { not: "canceled" },
        },
      });

      return NextResponse.json(orders);
    } catch (error) {
      console.log(error);
      return NextResponse.json({
        error: "Could not fetch orders, try again later",
      });
    }
  } else if (req.method === "DELETE") {
    const body = await req.json();

    if (body?.id) {
      const order = await prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
          where: { id: body.id },
          data: { status: "canceled" },
        });

        const amountsParsed: OrdersParsedAmounts[] = order.amounts.map((a) =>
          JSON.parse(JSON.stringify(a)),
        );
        const sortedEvents = amountsParsed
          .filter((e) => e.type === "event")
          .sort((a, b) => a.item.localeCompare(a.item));
        const sortedItems = amountsParsed
          .filter((e) => e.type === "market")
          .sort((a, b) => a.item.localeCompare(a.item));
        const eventsDBSorted = await Promise.all(
          sortedEvents.map(
            async (sE) =>
              await tx.event.findFirst({
                where: { id: sE.id },
                orderBy: { title: "asc" },
              }),
          ),
        );
        const itemsDBSorted = await Promise.all(
          sortedItems.map(
            async (sI) =>
              await tx.marketItem.findFirst({
                where: { id: sI.id },
                orderBy: { item: "asc" },
              }),
          ),
        );
        await Promise.all(
          eventsDBSorted.map(
            async (e, index) =>
              await tx.event.update({
                where: { id: e!.id },
                data: {
                  ticketsSold:
                    eventsDBSorted[index]!.ticketsSold -
                    sortedEvents[index].amount,
                },
              }),
          ),
        );
        await Promise.all(
          itemsDBSorted.map(
            async (i, index) =>
              await tx.marketItem.update({
                where: { id: i!.id },
                data: {
                  amountSold:
                    itemsDBSorted[index]!.amountSold -
                    sortedItems[index].amount,
                },
              }),
          ),
        );
        sortedItems.map((i) => revalidatePath(`/item/${i.item}`));
        sortedEvents.map((e) => revalidatePath(`/event/${e.item}`));

        return order;
      });

      if (order) {
        revalidatePath("/orders");
        return NextResponse.json(
          { message: "Order cancelled successfully" },
          { status: 200 },
        );
      } else {
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 },
        );
      }
    } else {
      return NextResponse.json(
        { error: "Provide order id and order status in body object" },
        { status: 405 },
      );
    }
  }
}

export { handler as GET, handler as DELETE };
