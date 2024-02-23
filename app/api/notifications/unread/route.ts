import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/ConnectPrisma";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if (!session?.user?.name) {
    return NextResponse.json({ error: "Not authorized" });
  }
  const unreadNotifsAmount = await prisma.notification.count({
    where: {
      AND: [
        { recipient: session.user.name },
        { read: false },
        { markedAsDeleted: false },
      ],
    },
  });
  return NextResponse.json({ unread: unreadNotifsAmount });
}
export { handler as GET };
