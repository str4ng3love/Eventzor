
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { options } from "../../auth/[...nextauth]/options"
import { prisma } from "@/lib/ConnectPrisma"
async function handler(req: Request) {
    const session = await getServerSession(options)
    if (!session?.user?.name) {
        return NextResponse.json({ error: 'Not authorized' })
    }
    const updated = await  prisma.notification.updateMany({ data: { read: true } })
    return NextResponse.json({ msg: 'All notifications marked as "read"' })

}

export { handler as GET }