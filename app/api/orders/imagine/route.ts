import { prisma } from "@/lib/ConnectPrisma"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { options } from "../../auth/[...nextauth]/options"
import { ParsedOrder } from "@/types/interfaces"



async function handler(req: Request) {
    const session = await getServerSession(options)
    if (!session) {
        return NextResponse.json({ error: "Not authorized." })
    }
    if (req.method === "POST") {
        const body = await req.json()
        const id = body.id

        if (!id) {
            return NextResponse.json(
                { error: "Bad request: Please provide Order's ID" },
                { status: 200 }
            )
        } else {
            try {
                const order = await prisma.$transaction(async (tx) => {
                    const order = await tx.order.update({ where: { id: id, status: { equals: "pendingPayment" } }, data: { status: "shipping" }, select: { id: true, buyerName: true, amounts: true } })
                    const amountsParsed: ParsedOrder[] = order.amounts.map(a => JSON.parse(JSON.stringify(a)))

                    const orderIds = amountsParsed.map(a=>a.id)


                    const recipients = [...new Set(await Promise.all(orderIds.map(async i => await tx.user.findFirst({ where: { OR: [{ events: { some: { id: i } } }, { marketItems: { some: { id: i } } }] }, select:{name:true} }))))]

                    await Promise.all(recipients.map(async r => r === null ? null : await tx.notification.create({ data: { action: "status", orderId: order.id, initiator: session.user?.name as string, recipient: r.name } })))

                    return order
                })

                revalidatePath('/orders')
                return NextResponse.json(
                    { message: "Payment Registered", order },
                    { status: 200 }
                )
            } catch (error) {
                console.log(error)
                return NextResponse.json(
                    { error: error },
                    { status: 200 })

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