import StatsDisplay from "@/app/components/dynamic/StatsDisplay"
import { prisma } from "@/lib/ConnectPrisma"
import { IType } from "@/types/enums"
import { notFound } from "next/navigation"




const page = async ({ params }: { params: { user: string } }) => {
    const user = params.user

    const userData = await prisma.user.findUnique({ where: { name: user }, select: { _count: { select: { comments: { where: { status: { not: "flaggedAsDeleted" } } }, events: true, marketItems: true } }, name: true } })

    if (!userData) {
        notFound()
    }



    return (

        <div className="w-[80%] mt-20">
            <div className="bg-bg_interactive p-8 ring-2 ring-primary rounded-md">
                <h1 className="font-bold text-xl">{userData.name}</h1>
                <div className="mt-8 grid grid-cols-3  text-sm">
                    <div className="col-span-3 flex h-12">
                        <span className="p-4 text-center items-center inline-flex">Stats :</span>
                    </div>
                    <div className="min-h-[2rem] p-2 border-l-2 border-primary">
                        <StatsDisplay stats={{ amount: userData._count.events, name: "Events" }} user={userData.name} type={IType.events} />
                    </div>
                    <div className="min-h-[2rem] p-2 border-l-2 border-primary">

                        <StatsDisplay stats={{ amount: userData._count.marketItems, name: "Items" }} user={userData.name} type={IType.items} />
                    </div>
                    <div className="min-h-[2rem] p-2 border-l-2 border-primary">

                        <StatsDisplay stats={{ amount: userData._count.comments, name: "Comments" }} user={userData.name} type={IType.comments} />
                    </div>
                </div>
            </div>

        </div>

    )
}


export default page