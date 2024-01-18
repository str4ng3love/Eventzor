import { emitter } from "@/helpers/EventEmitter";
import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";


export const runtime = 'nodejs';



async function handler() {
    const session = await getServerSession(options)

    const listener = emitter



    let responseSteam = new TransformStream()
    const writer = responseSteam.writable.getWriter()
    const encoder = new TextEncoder()


    listener.on('Notify', (e) => {
        console.log(e)
if (e.recipient === session?.user?.name) {
            writer.write(encoder.encode(`data: new item\n\n`))
        }

    })



    return new NextResponse(responseSteam.readable, {
        headers: {
            "Content-Type": "text/event-stream", Connection: "keep-alive", 'Cache-Control': "no-cache, no-transform"
        }
    })
}

export { handler as GET }