import { getServerSession } from "next-auth"
import { options } from "../auth/[...nextauth]/options"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/ConnectPrisma"

async function handler(req: Request) {
    const session = await getServerSession(options)
    if (!session?.user?.name) {
        return NextResponse.json({ message: "Not Authorized. Please login in to get notifications" })
    } else {
        const notifications = await prisma.notification.findMany({ where: { AND: [{ userRecip: { name: session.user.name } }, {markedAsDeleted:false}] }, orderBy: { id: 'desc' }, include:  {comment:{select:{message:true}} ,event: { select: { title: true } }, order: { select: { id: true } }, item: { select: { item: true } } } })
 
        return NextResponse.json({ notifications })
    }
}

export { handler as GET }