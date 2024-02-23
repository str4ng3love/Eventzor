import { prisma } from "@/lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";

async function handler(req: Request) {
  const body = await req.json();

  const session = await getServerSession(options);
  if (!session?.user?.name) {
    return NextResponse.json({ error: "Not authorized" });
  }
  if ((body.email && !body.email.includes("@")) || !body.email.includes(".")) {
    return NextResponse.json({ error: "Please provide a valid email" });
  } else {
    const email = await prisma.user.update({
      where: { name: session?.user?.name },
      data: { email: body.email },
      select: { email: true },
    });
    return NextResponse.json({ message: "Email updated" });
  }
}

export { handler as POST };
