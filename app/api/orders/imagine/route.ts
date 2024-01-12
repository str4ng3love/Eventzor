import { prisma } from "@/lib/ConnectPrisma"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"



async function handler(req: Request) {

    if (req.method === "POST") {
        const body = await req.json()
        const id = body.id
        console.log(id)
        if (!id) {
            return NextResponse.json(
                { error: "Bad request: Please provide Order's ID" },
                { status: 200 }
            )
        } else {
            try {
                const order = await prisma.order.update({ where: { id: id, status: { equals: "pendingPayment" } }, data: { status: "shipping" }, select: { id: true } })
                revalidatePath('/orders')
                return NextResponse.json(
                    { message: "Paymenet Registered", order },
                    { status: 200 }
                )
            } catch (error) {
                if(error instanceof PrismaClientKnownRequestError){
                    return NextResponse.json(
                        { error: error.message },
                        { status: 200 })
                }
            }
        }
    } else {
        return NextResponse.json(
            { error: "Bad request" },
            { status: 200 }
        );
    }


}

export { handler as POST };