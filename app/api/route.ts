import { prisma } from "@/lib/ConnectPrisma";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  if (req.method === "GET") {
    const deletedEvents = await prisma.event.deleteMany({});
    const deletedOrders = await prisma.order.deleteMany({});
    return NextResponse.json({ deleted: deletedEvents, deletedOrders });
  }
}

export { handler as GET };
