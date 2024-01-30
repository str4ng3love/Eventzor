import { prisma } from "@/lib/ConnectPrisma"
import { NextResponse } from "next/server"



async function handler(req: Request, { params }: { params: { id: string } }) {
    const id = params.id
    if (!id) {
        return NextResponse.json({ error: "Must provide comment id" })
    }
    const comment = await prisma.comment.findUnique({ where: { id: id,  }, include: { _count: { select: { likes: true, dislikes: true, children: true } } } })
    return NextResponse.json({ comment })
}

export { handler as GET }