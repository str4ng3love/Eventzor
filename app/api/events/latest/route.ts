import { getServerSession } from "next-auth"
import { options } from "../../auth/[...nextauth]/options"
import { NextResponse } from "next/server"
import {prisma} from '../../../../lib/ConnectPrisma'

export default async function handler(req:Request){
    if(req.method !== "GET"){
        return NextResponse.json({erro: 'Bad request'}, {status:400})
    }
    try {
    const session = await getServerSession(options)
    if(session?.user?.name){
        const latestEvent = await prisma.event.findFirst({where: {organizerName: session.user.name}, orderBy:{id:'desc'}})
        if(latestEvent){
            return NextResponse.json(latestEvent)
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