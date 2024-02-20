import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/ConnectPrisma";

async function handler(req: Request) {
    const session = await getServerSession(options)
    if (!session?.user?.name) {
        return NextResponse.json({ error: 'Not authorized' })
    }
    if (req.method === "GET") {
        const marked = await prisma.notification.updateMany({ where: { AND: [{ recipient: session.user.name }, { markedAsSeen: false }] }, data: { markedAsSeen: true } })

        return NextResponse.json({ message: `Notifications market as seen count: ${marked.count}` })
    }
}

export { handler as GET }