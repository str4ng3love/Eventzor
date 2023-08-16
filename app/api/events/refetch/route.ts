import { NextResponse } from "next/server";

import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/ConnectPrisma";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if (req.method == "GET" && session?.user?.name) {
    const events = await prisma.event.findMany({
      where: { organizerName: session?.user?.name },
    });
    if (events) {
      return NextResponse.json(events);
    } else {
      return NextResponse.json({ error: "Something went wrong." });
    }
  } else {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export { handler as GET };
