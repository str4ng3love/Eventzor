
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { options } from "../../../auth/[...nextauth]/options"
import { prisma } from "@/lib/ConnectPrisma"
async function handler(req: Request) {
    const session = await getServerSession(options)
    if (!session?.user?.name) {
        return NextResponse.json({ error: 'Not authorized' })
    }
    const body = await req.json()
    const id = body.id
    if (!id) {
        return NextResponse.json({ error: 'Must provide a valid notification id' })
    }
    const updated = await prisma.notification.update({ where: { id: id }, data: { read: true } })
    if(updated){
        return NextResponse.json({ error: `Could not mark notification as "read"` })
    } 
    
    return NextResponse.json({ msg: `Notification marked as "read"` })
}

export { handler as POST }