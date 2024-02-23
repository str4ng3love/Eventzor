import EventCarousel from "@/app/components/dynamic/Events/EventCarousel";
import ItemCarousel from "@/app/components/dynamic/Market/ItemCarousel";
import StatsDisplay from "@/app/components/dynamic/StatsDisplay";
import { prisma } from "@/lib/ConnectPrisma";
import { IType } from "@/types/enums";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: { user: string } }) => {
  const user = params.user;

  const userData = await prisma.user.findUnique({
    where: { name: user },
    select: {
      _count: {
        select: {
          comments: { where: { status: { not: "flaggedAsDeleted" } } },
          events: true,
          marketItems: true,
        },
      },
      name: true,
      events: { orderBy: { ticketsSold: "desc" }, take: 3 },
      marketItems: { orderBy: { amountSold: "desc" }, take: 3 },
    },
  });

  if (!userData) {
    notFound();
  }

  return (
    <div className="mt-20 w-full px-4 md:w-[80%] md:px-0">
      <div className="min-h-[16rem] rounded-md bg-black/20 p-8 shadow-lg ring-primary dark:shadow-none dark:ring-2 ">
        <h1 className="text-xl font-bold">{userData.name}</h1>

        <div className="mt-8 grid  grid-cols-1 text-sm md:grid-cols-3">
          <div className="col-span-1 flex h-12 md:col-span-3">
            <span className="inline-flex items-center p-4 text-center">
              Stats :
            </span>
          </div>
          <div className="border-l-2 border-primary p-2">
            <StatsDisplay
              stats={{ amount: userData._count.events, name: "Events" }}
              user={userData.name}
              type={IType.events}
            />
          </div>
          <div className="border-l-2 border-primary p-2">
            <StatsDisplay
              stats={{ amount: userData._count.marketItems, name: "Items" }}
              user={userData.name}
              type={IType.items}
            />
          </div>
          <div className="border-l-2 border-primary p-2">
            <StatsDisplay
              stats={{ amount: userData._count.comments, name: "Comments" }}
              user={userData.name}
              type={IType.comments}
            />
          </div>
        </div>
      </div>
      <div className="my-8 flex w-full flex-col items-center  justify-center rounded-md bg-black/20 p-0 shadow-lg dark:shadow-none md:px-2">
        {userData.events.length >= 3 ? (
          <EventCarousel
            heading={`${user}'s top 3 popular events`}
            items={userData.events}
          />
        ) : (
          <></>
        )}
        {userData.marketItems.length >= 3 ? (
          <ItemCarousel
            heading={`${user}'s top 3 popular items`}
            items={userData.marketItems}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default page;
