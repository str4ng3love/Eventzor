import { prisma } from "@/lib/ConnectPrisma";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  if (req.method === "GET") {
 await prisma.order.deleteMany({})
return NextResponse.json({message:"Items and Events deleted"})
  }
}

export { handler as GET };
