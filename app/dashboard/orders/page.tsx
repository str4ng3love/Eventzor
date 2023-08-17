import { options } from "@/app/api/auth/[...nextauth]/options";
import { Heading2, Heading4 } from "../../components/static/Heading";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/ConnectPrisma";
import { OrderBrowser } from "@/app/components/dynamic/Orders/OrderBrowser";

const getOrders = async () => {
  const session = await getServerSession(options);

  const orders = await prisma.order.findMany({
    where: {
      merchantName: session?.user?.name as string,
    },
    orderBy: [{ item: "asc" }],
  });
  return {
    orders,
  };
};

const page = async () => {
  const {orders} = await getOrders()
  return (
    <>
      <div className="flex flex-col pl-10">
        <Heading2 text="orders" />
        <Heading4 text="Browse and menage orders" />
      </div>
      <OrderBrowser orders={orders}/>
    </>
  );
};

export default page;
