import { emitter } from "@/helpers/eventEmitter";
import { getServerSession } from "next-auth";

import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";


export const dynamic = 'force-dynamic';




async function handler(req: NextRequest) {
    const session = await getServerSession(options)
    if (!session) {
        return NextResponse.json({ message: "Not Authorized" })
    }
    const listener = emitter

    const responseSteam = new TransformStream()
    const writer = responseSteam.writable.getWriter()
    const encoder = new TextEncoder()
    const eventName = `Notify@${session.user?.name}`

    req.signal.addEventListener("abort", async (e) => {

        listener.removeAllListeners(eventName)

    })

    listener.on(eventName, (e) => {

        writer.write(encoder.encode(`data: new item\n\n`))
    })
    
  

    const respStream = new NextResponse(responseSteam.readable, {
        headers: {
            "Content-Type": "text/event-stream", Connection: "keep-alive", 'Cache-Control': "no-cache, no-transform"
        }
    })

    return respStream


}

export { handler as GET }