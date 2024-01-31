import { getServerSession } from "next-auth"
import { options } from "../auth/[...nextauth]/options"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/ConnectPrisma"

async function handler (req:Request){
    const session = await getServerSession(options)
    const {searchParams} = new URL(req.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')
    if(!id || !type) return NextResponse.json({error: "Provide id of an object"})
    if(!session?.user?.name){ return NextResponse.json({error: "Not authenticated"})}
    if(type === "comment"){
        const social = await prisma.comment.findFirst({where:{id:id}, select:{_count:{select:{likes:{where:{userName:session.user.name}}, dislikes:{where:{userName:session.user.name}}}}}})
        return NextResponse.json({social})
    }
    if(type === "item"){
        const social = await prisma.marketItem.findFirst({where:{id:id}, select:{_count:{select:{likes:{where:{userName:session.user.name}}, dislikes:{where:{userName:session.user.name}}}}}})
        return NextResponse.json({social})
    }
    if(type === "event"){
        const social = await prisma.event.findFirst({where:{id:id}, select:{_count:{select:{likes:{where:{userName:session.user.name}}, dislikes:{where:{userName:session.user.name}}}}}})
        return NextResponse.json({social})
    }

}

export {handler as GET}