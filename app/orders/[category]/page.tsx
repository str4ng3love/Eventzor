import { prisma } from "@/lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options";
import { Heading1 } from "../../components/static/Heading";
import { StatusOrder } from "@prisma/client";
import { redirect } from "next/navigation";
import { ParsedOrder } from "@/types/interfaces";
import { OrderBrowser } from "@/app/components/dynamic/Orders/OrderBrowser";

const page = async ({ params }: { params: { category: string } }) => {
  const session = await getServerSession(options);
  const category = params.category;
  let query: StatusOrder | null;

  switch (category) {
    case "pending":
      query = "pendingPayment";
      break;
    case "shipping":
      query = "shipping";
      break;
    case "completed":
      query = "completed";
      break;
    case "canceled":
      query = "canceled";
      break;
    default:
      query = null;
      break;
  }
  if (query === null) {
    return redirect("/orders");
  } else {
    const getOrders = async () => {
      const orders = await prisma.order.findMany({
        where: {
          AND: [
            {
              buyerName: session?.user?.name as string,
              status: query as StatusOrder,
            },
          ],
        },
        orderBy: { id: "desc" },
      });
      const parsedOrders: ParsedOrder[] = JSON.parse(JSON.stringify(orders));
      return parsedOrders;
    };

    const orders = await getOrders();

    if (orders.length === 0) {
      return (
        <div className=" flex w-full justify-start pt-20 md:justify-center">
          <div className="w-full bg-black/20 p-1 md:w-[80%] md:p-8">
            <Heading1
              text={`you have no ${category !== "shipping" ? category : ""} orders ${category === "shipping" ? "in" + " " + category : ""}`}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="flex w-full justify-start pt-20 md:justify-center">
        <div className="w-full p-1 md:w-[80%] md:p-8">
          <OrderBrowser ordersArray={orders} />
        </div>
      </div>
    );
  }
};

export default page;
