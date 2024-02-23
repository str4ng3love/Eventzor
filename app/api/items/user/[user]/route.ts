import { prisma } from "@/lib/ConnectPrisma";
import { NextResponse } from "next/server";

async function handler(req: Request, { params }: { params: { user: string } }) {
  const user = params.user;

  if (!user) {
    return NextResponse.json({ error: "Must provide a user name" });
  }
  const items = await prisma.marketItem.findMany({
    where: { merchantName: user },
    select: { item: true },
    orderBy: { item: "desc" },
  });

  return NextResponse.json({ items });
}

export { handler as GET };
