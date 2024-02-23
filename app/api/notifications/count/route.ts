import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/ConnectPrisma";
import { options } from "../../auth/[...nextauth]/options";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if (!session?.user?.name) {
    return NextResponse.json({
      message: "Not Authorized. Please login in to get notifications",
    });
  } else {
    const count = await prisma.notification.count({
      where: {
        AND: [{ userRecip: { name: session.user.name } }, { read: false }],
      },
    });

    return NextResponse.json({ count });
  }
}

export { handler as GET };
