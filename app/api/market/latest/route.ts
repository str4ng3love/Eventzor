import { getServerSession } from "next-auth"
import { options } from "../../auth/[...nextauth]/options"
import { NextResponse } from "next/server"
import {prisma} from '../../../../lib/ConnectPrisma'

async function handler(req:Request){
    if(req.method !== "GET"){
        return NextResponse.json({error: 'Bad request'}, {status:400})
    }
    try {
    const session = await getServerSession(options)
    if(session?.user?.name){
        const latestItem = await prisma.marketItem.findFirst({where: {merchantName: session.user.name}, orderBy:{id:'desc'}})
        if(latestItem){
            return NextResponse.json(latestItem)
        } else {
            return NextResponse.json({error: 'Something went wrong.'})
        }
    } 
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: 'Internal server error.'}, {status:500})
    }
}

export { handler as GET}