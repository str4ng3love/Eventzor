import { options } from "@/app/api/auth/[...nextauth]/options";
import { triggerNotification } from "@/helpers/eventEmitter";
import { prisma } from "@/lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


async function handler(req: Request) {
    const session = await getServerSession(options)
    if (!session?.user?.name)
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    if (req.method === "GET") {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        const dislike = await prisma.dislike.findFirst({
            where: { AND: [{ userName: session?.user?.name }, { MarketItemId: id }] },
        });

        return NextResponse.json({ dislike });
    }
    const body = await req.json();
    if (!body)
        return NextResponse.json(
            { error: "Provide dislike data" },
            { status: 400 }
        );
    if (req.method === "POST") {
        try {
            const item = await prisma.marketItem.findFirst({
                where: {
                    AND: [
                        { id: body.id },
                        {
                            dislikes: {
                                some: { user: { name: session.user?.name as string } },
                            },
                        },
                    ],
                },
            });

            if (item) {
                return NextResponse.json({
                    message: "Item already disliked",

                });
            } else {
                const item = await prisma.$transaction(async (tx) => {
                    const merchant = await tx.user.findFirst({
                        where: {
                            marketItems: {
                                some: { id: body.id }
                            }
                        }
                    })
                    if (!merchant) {
                        return
                    }
                    const item = await tx.marketItem.update({
                        where: { id: body.id },
                        data: {
                            dislikes: {
                                create: {
                                    user: { connect: { name: session.user?.name as string } },
                                },
                            },
                            likes: { deleteMany: { userName: session.user?.name as string } },
                        }, select: { merchantName: true, id: true, dislikes: { where: { AND: [{ userName: { equals: session.user?.name as string } }, { MarketItemId: body.id }] } } }
                    })
                    await tx.notification.create({ data: { targetDislike: { connect: { id: item.dislikes[0].id } }, action: "dislike", item: { connect: { id: body.id } }, userRecip: { connect: { name: item.merchantName } }, userInit: { connect: { name: session.user?.name as string } } } })

                    triggerNotification([merchant.name])
                    return item
                })
                if (!item) {
                    return NextResponse.json({ error: "Something went wrong." })
                }
                // SSE Broadcast 

                return NextResponse.json({
                    message: "Dislike created successfully",
                });
            }
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 }
            );
        }
    }
    if (req.method === "DELETE") {
        try {
            const item = await prisma.$transaction(async (tx) => {
                const item = tx.marketItem.update({
                    where: { id: body.id },
                    data: { likes: { deleteMany: { userName: session?.user?.name as string } } },
                })
                await tx.notification.deleteMany({ where: { AND: [{ marketItemId: body.id }, { initiator: session.user?.name as string }, { action: "dislike" }] } })
                return item
            });
            revalidatePath(`/market/${item.item}`, 'page')
            return NextResponse.json({ message: "Disike deleted successfully" });
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 }
            );
        }
    }
}



export { handler as POST, handler as DELETE, handler as GET };