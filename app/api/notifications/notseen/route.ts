import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/ConnectPrisma";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if (!session?.user?.name) {
    return NextResponse.json({ error: "Not Authorized" });
  }
  if (req.method === "GET") {
    const unseenNotifications = await prisma.notification.findMany({
      where: {
        AND: [{ recipient: session.user.name }, { markedAsSeen: false }],
      },
      orderBy: { id: "desc" },
      select: { id: true },
    });
    return NextResponse.json({ unseenNotifications });
  }
}

export { handler as GET };
