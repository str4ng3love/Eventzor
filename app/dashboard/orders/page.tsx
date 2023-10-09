
import { MyOrderBrowser } from "@/app/components/dynamic/Orders/MyOrderBrowser";
import { Heading2, Heading4 } from "../../components/static/Heading";

// import { OrderBrowser } from "@/app/components/dynamic/Orders/OrderBrowser";


const page = async () => {

  return (
    <>
      <div className="flex flex-col pl-10">
        <Heading2 text="orders" />
        <Heading4 text="Browse and menage orders" />
      </div>
      <MyOrderBrowser />
    </>
  );
};

export default page;
