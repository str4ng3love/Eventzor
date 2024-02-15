import { prisma } from "@/lib/ConnectPrisma"
import { getServerSession } from "next-auth"
import { options } from "../api/auth/[...nextauth]/options"
import { Heading1 } from "../components/static/Heading"
import { ParsedOrder } from "@/types/interfaces"
import { OrderBrowser } from "../components/dynamic/Orders/OrderBrowser"


const page = async () => {
  const session = await getServerSession(options)
  const getOrders = async () => {
    const orders = await prisma.order.findMany({ where: { AND: [{ buyerName: session?.user?.name as string }, { OR: [{ status: "pendingPayment" }, { status: "shipping" }] }] }, orderBy: { orderedAt: "desc" } })
    const parsedOrders: ParsedOrder[] = JSON.parse(JSON.stringify(orders))
    return parsedOrders
  }
  const orders = await getOrders()

  if (orders.length === 0) {
    return (
      <div className="pt-20 w-full flex justify-center">
        <div className="md:w-[80%] w-full md:p-8 p-1">

          <Heading1 text="your orders are empty" />

        </div>
      </div>
    )
  }
  return (
    <div className="pt-20 w-full flex justify-center">
      <div className="md:w-[80%] w-full md:p-8 p-1">

        <OrderBrowser ordersArray={orders} />

      </div>
    </div>
  )
}

export default page