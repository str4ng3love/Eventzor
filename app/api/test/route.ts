
import { TriggerNotification } from "@/helpers/EventEmitter"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { options } from "../auth/[...nextauth]/options"




async function handler(req: Request) {
    const session = await getServerSession(options)
    if(!session?.user?.name){
        return NextResponse.json({ error:'Not authorized' }) 
    }

    await TriggerNotification(["gresasty", "FelixWilliams"])
    return NextResponse.json({ ok: "ok" })
}

export { handler as GET }