
import { prisma } from "@/lib/ConnectPrisma";
import ItemCarousel from "../components/dynamic/Market/ItemCarousel";
import ItemsBrowser from "../components/dynamic/Market/ItemBrowser";


// get market items
const getNewItems = async () => {
  const newItems = await prisma.marketItem.findMany({
    orderBy: { id: "asc" },
    take: 10,
  });
  return {
    newItems,
  };
};
const getItems = async () => {
  const items = await prisma.marketItem.findMany({
    orderBy: { id: "asc" },
    take: 20,
  });
  return {
    items,
  };
};
const page = async () => {
const {items} = await getItems()
const {newItems} = await getNewItems()
  return (
<main className="flex flex-col items-center min-h-[calc(100dvh_-_4rem)]">
      {/* TODO: [slugified] dynamic page for a single item */}
      <div className="lg:bg-item-hero w-full bg-cover bg-center bg-no-repeat transition-all">
        <ItemCarousel heading="newest on market" items={newItems} fullWidthBlur={true} darkBgAlpha={true}/>
      </div>

      {/* TODO: Item browser with sorting, pagination etc */}
      <ItemsBrowser items={items} />
    </main>
  );
};

export default page;
