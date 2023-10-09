import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/ConnectPrisma";

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
    console.log(body)
    if (body?.id) {
      const order = await prisma.order.update({
        where: { id: body.id },
        data: { status: "canceled" },
      });
 
      if (order) {
        return NextResponse.json(
          { message: "Order cancelled successfully" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Provide order id and order status in body object" },
        { status: 405 }
      );
    }
  }
}

export { handler as GET, handler as DELETE };
