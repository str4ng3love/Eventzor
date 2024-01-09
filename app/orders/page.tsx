import { prisma } from "@/lib/ConnectPrisma"
import { getServerSession } from "next-auth"
import { options } from "../api/auth/[...nextauth]/options"
import { Heading1 } from "../components/static/Heading"
import { MyOrderBrowser } from "../components/dynamic/Orders/MyOrderBrowser"
import { ParsedOrder } from "@/types/interfaces"


const page = async ({searchParams}:{searchParams:{[key:string]: string | string[]| undefined}}) => {
    const session = await getServerSession(options)
    const order = searchParams.order === 'desc' ? 'desc': 'asc'
    const getOrders = async () => {
        const orders = await prisma.order.findMany({where:{AND:[{buyerName:session?.user?.name as string}, {OR:[{status:"pendingPayment"}, {status:"shipping"}]}]}, orderBy: {orderedAt: order}})
        const parsedOrders:ParsedOrder[]= JSON.parse(JSON.stringify(orders))
        return parsedOrders
      }
      const orders = await getOrders()
  
      if (orders.length === 0) {
        return (
          <div className="pt-20 w-full flex justify-center">
            <div className="w-[80%] p-8">
  
              <Heading1 text="your orders are empty" />
  
            </div>
          </div>
        )
      }
    return(
        <div className="pt-20 w-full flex justify-center">
        <div className="w-[80%] p-8">

          <MyOrderBrowser ordersArray={orders} email="" />

        </div>
      </div>
    )
}

export default page