import { options } from "@/app/api/auth/[...nextauth]/options";
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
                                some: { user: { username: session.user?.name as string } },
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
                const item = await prisma.marketItem.update({
                    where: { id: body.id },
                    data: {
                        dislikes: {
                            create: {
                                user: { connect: { name: session.user?.name as string } },
                            },
                        },
                        likes: { deleteMany: { userName: session.user.name } },
                    },
                });
           
                revalidatePath(`/market/${item.item}`, 'page')
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
            const item = await prisma.marketItem.update({
                where: { id: body.id },
                data: { dislikes: { deleteMany: { userName: session.user.name } } },
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