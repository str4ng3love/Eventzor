import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { options } from "../../auth/[...nextauth]/options"
import { prisma } from "@/lib/ConnectPrisma"

async function handler(req: Request) {
    if (req.method === "GET") {
        const session = await getServerSession(options)
        if (!session?.user?.name) {
            return NextResponse.json({ error: "Not Authorized" }, { status: 401 })
        }
        const email = await prisma.user.findFirst({ where: { username: session.user?.name }, select:{email:true}})

        return NextResponse.json(email)
    }
    else if (req.method === 'POST') {
        const session = await getServerSession(options)
        if (!session) {
            return NextResponse.json({ error: "Not Authorized" }, { status: 401 })
        }
        const body = await req.json()

        if (body.email.toString().length < 7 || !body.email.toString().includes("@") || !body.email.toString().includes(".")) {
            return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 })
        }
        try {
            const user = await prisma.user.update({ where: { username: session.user?.name as string }, data: { email: body.email } })
            if (!user) {
                return NextResponse.json({ message: 'Something went wrong' })
            }

            return NextResponse.json({ message: 'Email updated successfully' })
        } catch (error) {
            console.log(error)
            return NextResponse.json({ message: 'Internal server error' })
        }
    } else {
        return NextResponse.json({ error: "Bad request" }, { status: 400 })
    }
}


export { handler as POST, handler as GET }