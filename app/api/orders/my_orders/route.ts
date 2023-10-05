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
        where: { buyerName: session.user?.name ? session.user.name : "" },
      });
      
      return NextResponse.json(orders);
    } catch (error) {
      console.log(error);
      return NextResponse.json({
        error: "Could not fetch orders, try again later",
      });
    }
  }
}

export { handler as GET };
