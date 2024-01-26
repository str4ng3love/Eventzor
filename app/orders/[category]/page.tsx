import { MyOrderBrowser } from "../../components/dynamic/Orders/MyOrderBrowser"
import { prisma } from "@/lib/ConnectPrisma"
import { getServerSession } from "next-auth"
import { options } from "../../api/auth/[...nextauth]/options"
import { Heading1 } from "../../components/static/Heading"
import { StatusOrder } from "@prisma/client"
import { redirect } from "next/navigation"
import { ParsedOrder } from "@/types/interfaces"



const page = async ({ params, searchParams }: { params: { category: string }, searchParams: { [key: string]: string | string[] | undefined } }) => {
  const session = await getServerSession(options)
  const order = searchParams.order === "desc" ? 'desc' : 'asc'
  const category = params.category
  let query: StatusOrder | null

  switch (category) {
    case 'pending':
      query = "pendingPayment"
      break;
    case 'shipping':
      query = "shipping"
      break;
    case 'completed':
      query = "completed"
      break;
    case 'canceled':
      query = "canceled"
      break;
    default:
      query = null
      break;
  }
  if (query === null) {
    return (
      redirect("/orders")
    );
  } else {

    const getOrders = async () => {

      const orders = await prisma.order.findMany({ where: { AND: [{ buyerName: session?.user?.name as string, status: query as StatusOrder }] }, orderBy: { id: order } })
      const parsedOrders: ParsedOrder[] = JSON.parse(JSON.stringify(orders))
      return parsedOrders
    }

    const orders = await getOrders()

    if (orders.length === 0) {
      return (
        <div className=" pt-20 w-full flex justify-center">
          <div className="w-[80%] p-8">

            <Heading1 text={`you have no ${category !== 'shipping' ? category : ""} orders ${category === 'shipping' ? "in" + " " + category : ""}`} />

          </div>
        </div>
      )
    }
    return (
      <div className="pt-20 w-full flex justify-center">
        <div className="w-[80%] p-8">

          <MyOrderBrowser ordersArray={orders} email={session?.user?.email as string} />

        </div>
      </div>
    )
  }
}

export default page