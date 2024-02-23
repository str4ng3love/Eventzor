import { prisma } from "@/lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { OrdersParsedAmounts } from "@/types/interfaces";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Not authorized." });
  }
  if (req.method === "POST") {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { error: "Bad request: Please provide Order's ID" },
        { status: 200 },
      );
    } else {
      try {
        const order = await prisma.$transaction(async (tx) => {
          const order = await tx.order.update({
            where: { id: id, status: { equals: "pendingPayment" } },
            data: { status: "shipping" },
            select: { id: true, buyerName: true, amounts: true },
          });
          const amountsParsed: OrdersParsedAmounts[] = order.amounts.map((a) =>
            JSON.parse(JSON.stringify(a)),
          );

          const orderIds = amountsParsed.map((a) => a.id);
          const events = amountsParsed.filter((a) => a.type === "event");
          const marketItems = amountsParsed.filter((a) => a.type === "market");
          // fix needed
          await Promise.all(
            events.map(
              async (e) =>
                await tx.event.update({
                  where: { id: e.id },
                  data: { ticketsSold: e.amount },
                }),
            ),
          );
          await Promise.all(
            marketItems.map(
              async (m) =>
                await tx.marketItem.update({
                  where: { id: m.id },
                  data: { amountSold: m.amount },
                }),
            ),
          );

          const recipients = [
            ...new Set(
              await Promise.all(
                orderIds.map(
                  async (i) =>
                    await tx.user.findFirst({
                      where: {
                        OR: [
                          { events: { some: { id: i } } },
                          { marketItems: { some: { id: i } } },
                        ],
                      },
                      select: { name: true },
                    }),
                ),
              ),
            ),
          ];

          await Promise.all(
            recipients.map(async (r) =>
              r === null
                ? null
                : await tx.notification.updateMany({
                    where: { orderId: id },
                    data: {
                      action: "status",
                      orderId: order.id,
                      initiator: session.user?.name as string,
                      recipient: r.name,
                    },
                  }),
            ),
          );

          return order;
        });

        revalidatePath("/orders");
        return NextResponse.json(
          { message: "Payment Registered", order },
          { status: 200 },
        );
      } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 200 });
      }
    }
  } else {
    return NextResponse.json({ error: "Bad request" }, { status: 200 });
  }
}

export { handler as POST };
