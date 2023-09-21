export const dynamic = "force-dynamic";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { Heading2, Heading4 } from "../../components/static/Heading";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/ConnectPrisma";
import MyItemsBrowser from "@/app/components/dynamic/Market/MyItemsBrowser";

const getItems = async () => {
  const session = await getServerSession(options);

  const items = await prisma.marketItem.findMany({
    where: {
      merchantName: session?.user?.name as string,
    },
    orderBy: [{ item: "asc" }],
  });

  return {
    items,
  };
};

const page = async () => {

  return (
    <>
      <div className="flex flex-col pl-10">
        <Heading2 text="items" />
        <Heading4 text="Browse and menage items" />
      </div>
      <MyItemsBrowser  />
    </>
  );
};

export default page;
