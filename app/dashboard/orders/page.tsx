
import { MyOrderBrowser } from "@/app/components/dynamic/Orders/MyOrderBrowser";
import { Heading2, Heading4 } from "../../components/static/Heading";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

// import { OrderBrowser } from "@/app/components/dynamic/Orders/OrderBrowser";


const page = async () => {
// const session = await getServerSession(options)

  return (
    <>
      <div className="flex flex-col pl-10">
        <Heading2 text="orders" />
        <Heading4 text="Browse and menage orders" />
      </div>
      {/* <MyOrderBrowser email={session?.user?.email as string} ordersArray={} /> */}
    </>
  );
};

export default page;
