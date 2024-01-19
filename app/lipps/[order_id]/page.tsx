
import Payment from "@/app/components/dynamic/Lipps/Payment"
import { prisma } from "@/lib/ConnectPrisma"
import { ParsedOrder } from "@/types/interfaces"


const page = async ({ params, searchParams }: { params: { order_id: string }, searchParams: { [key: string]: string | string[] | undefined } }) => {

    const id = params.order_id
    let currency
    typeof searchParams.c === "string" ?
        currency = searchParams.c : currency = "usd"

    const order = await prisma.order.findUnique({ where: { id: id }, select: { amounts: true, currency: true } })

    const parsedOrders: ParsedOrder = JSON.parse(JSON.stringify(order))



    return (

        <div className="flex flex-col justify-center gap-4 p-8 items-center ">
            You&apos;re paying for order&nbsp;:<b>{id}</b>
            <Payment id={id} orders={parsedOrders} />


        </div>

    )
}


export default page