
import { Heading2, Heading4 } from "../../components/static/Heading";

import { OrderBrowser } from "@/app/components/dynamic/Orders/OrderBrowser";


const page = async () => {

  return (
    <>
      <div className="flex flex-col pl-10">
        <Heading2 text="orders" />
        <Heading4 text="Browse and menage orders" />
      </div>
      {/* <OrderBrowser orders={orders}/> */}
    </>
  );
};

export default page;
