import { prisma } from "@/lib/ConnectPrisma"
import { NextResponse } from "next/server"



async function handler(req: Request, { params }: { params: { user: string } }) {
    const user = params.user


    if (!user) {
        return NextResponse.json({ error: 'Must provide a user name' })
    }
    const comments = await prisma.comment.findMany({ where: { authorName: user }, select: { message: true, id:true }, orderBy:{message:"desc"} })
  
    return NextResponse.json({ comments })

}

export { handler as GET }