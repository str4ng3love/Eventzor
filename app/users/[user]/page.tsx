import EventCarousel from "@/app/components/dynamic/Events/EventCarousel"
import ItemCarousel from "@/app/components/dynamic/Market/ItemCarousel"
import StatsDisplay from "@/app/components/dynamic/StatsDisplay"
import { prisma } from "@/lib/ConnectPrisma"
import { IType } from "@/types/enums"
import { notFound } from "next/navigation"




const page = async ({ params }: { params: { user: string } }) => {
    const user = params.user

    const userData = await prisma.user.findUnique({ where: { name: user }, select: { _count: { select: { comments: { where: { status: { not: "flaggedAsDeleted" } } }, events: true, marketItems: true } }, name: true, events: { orderBy: { ticketsSold: "desc" }, take: 3 }, marketItems: { orderBy: { amountSold: "desc" }, take: 3 } } })

    if (!userData) {
        notFound()
    }


    return (

        <div className="w-full px-4 md:px-0 md:w-[80%] mt-20">
            <div className="bg-black/20 p-8 shadow-lg dark:shadow-none dark:ring-2 ring-primary rounded-md min-h-[16rem] ">
                <h1 className="font-bold text-xl">{userData.name}</h1>

                <div className="mt-8 grid  md:grid-cols-3 grid-cols-1 text-sm">
                    <div className="col-span-1 md:col-span-3 flex h-12">
                        <span className="p-4 text-center items-center inline-flex">Stats :</span>
                    </div>
                    <div className="p-2 border-l-2 border-primary">
                        <StatsDisplay stats={{ amount: userData._count.events, name: "Events" }} user={userData.name} type={IType.events} />
                    </div>
                    <div className="p-2 border-l-2 border-primary">

                        <StatsDisplay stats={{ amount: userData._count.marketItems, name: "Items" }} user={userData.name} type={IType.items} />
                    </div>
                    <div className="p-2 border-l-2 border-primary">

                        <StatsDisplay stats={{ amount: userData._count.comments, name: "Comments" }} user={userData.name} type={IType.comments} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center my-8  p-0 md:px-2 w-full bg-black/20 rounded-md dark:shadow-none shadow-lg">
                {userData.events.length >= 3 ? <EventCarousel heading={`${user}'s top 3 popular events`} items={userData.events} /> : <></>}
                {userData.marketItems.length >= 3 ? <ItemCarousel heading={`${user}'s top 3 popular items`} items={userData.marketItems} /> : <></>}
            </div>
        </div>

    )
}


export default page