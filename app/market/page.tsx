import { prisma } from "@/lib/ConnectPrisma";

import Button from "../components/dynamic/Button";
import { Prisma } from "@prisma/client";
import ItemsBrowser from "../components/dynamic/Market/ItemBrowser";

const getItemsAndAmount = async () => {
  const query: Prisma.MarketItemFindManyArgs = {
    where: { images: { isEmpty: false } }, take: 10
  }
  const [items, count] = await prisma.$transaction([
    prisma.marketItem.findMany(query), prisma.marketItem.count({ where: query.where })
  ])
  return {
    items, count
  }
}

const page = async () => {

  const { items, count } = await getItemsAndAmount();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="font-bold text-xl mb-12">There are no Items in the DB</h1>
        <Button title="go to home" text="go to Home" link="/" />
      </div>
    );
  } else {
    return (
      <>

        {/* TODO: Event browser with sorting, pagination etc */}
        <ItemsBrowser items={items} count={count} />
      </>
    );
  }
};

export default page;
