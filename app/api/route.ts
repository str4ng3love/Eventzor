import { prisma } from "@/lib/ConnectPrisma";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  if (req.method === "GET") {
    const deleted = await prisma.event.deleteMany({});
    return NextResponse.json({ deleted: deleted });
  }
}

export { handler as GET };
