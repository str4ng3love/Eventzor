import { prisma } from "@/lib/ConnectPrisma";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  if (req.method === "GET") {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const replies = await prisma.comment.findMany({
      where: { parentId: id },
      include: {
        _count: { select: { children: true, likes: true, dislikes: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(replies);
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}

export { handler as GET };
