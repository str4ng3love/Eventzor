import { prisma } from "@/lib/ConnectPrisma";
import { NextResponse } from "next/server";

async function handler(req: Request, { params }: { params: { user: string } }) {
  const user = params.user;

  if (!user) {
    return NextResponse.json({ error: "Must provide a user name" });
  }
  const events = await prisma.event.findMany({
    where: { organizerName: user },
    select: { title: true },
    orderBy: { title: "desc" },
  });

  return NextResponse.json({ events });
}

export { handler as GET };
