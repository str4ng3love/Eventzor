import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../../../auth/[...nextauth]/options";
import { prisma } from "@/lib/ConnectPrisma";
import { revalidatePath } from "next/cache";
import { ObjectId } from "bson";
import { TriggerNotification } from "@/helpers/EventEmitter";
async function handler(req: Request) {
  const session = await getServerSession(options);
  if (!session?.user?.name)
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  if (req.method === "GET") {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const like = await prisma.like.findFirst({
      where: { AND: [{ userName: session?.user?.name }, { MarketItemId: id }] },
    });

    return NextResponse.json({ like });
  }
  const body = await req.json();
  if (!body)
    return NextResponse.json({ error: "Provide like data" }, { status: 400 });

  if (req.method === "POST") {
    try {
      const item = await prisma.marketItem.findFirst({
        where: {
          AND: [
            { id: body.id },
            {
              likes: {
                some: { user: { name: session.user?.name as string } },
              },
            },
          ],
        },
      });

      if (item) {
        return NextResponse.json({ message: "Item already liked" });
      } else {
        const item = await prisma.$transaction(async (tx) => {
          const organizer = await tx.user.findFirst({
            where: {
              marketItems: {
                some: { id: body.id }
              }
            }
          })
          const notification = await tx.notification.findFirst({ where: { orderId: body.id, action: "like" }, select: { id: true } })
          const randomId = new ObjectId().toString()

          if (!organizer) {
            // need to handle it better
            return
          }
          const item = await tx.marketItem.update({
            where: { id: body.id },
            data: {
              likes: {
                create: {
                  user: { connect: { name: session.user?.name as string } },
                },
              },
              dislikes: { deleteMany: { userName: session.user?.name as string } },
            }, select: {
              merchantName: true, item: true, id: true, likes: {
                where: { AND: [{ userName: { equals: session.user?.name as string } }, { MarketItemId: body.id }] }
              }
            }
          })
          await tx.notification.create({ data: { targetLike: { connect: { id: item.likes[0].id } }, action: "like", comment: { connect: { id: body.id } }, userRecip: { connect: { name: item.merchantName } }, userInit: { connect: { name: session.user?.name as string } } } })

          TriggerNotification([organizer.name])
          return item
        })
        if (!item?.item) {
          return NextResponse.json({ error: "Something went wrong." })
        }
        // SSE Broadcast 
        revalidatePath(`/market/${item?.item}`, "page")
        return NextResponse.json({
          message: "Like created successfully"
        });
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: error });
    }
  }
  if (req.method === "DELETE") {
    try {
      const item = await prisma.$transaction(async (tx) => {
        const item = tx.marketItem.update({
          where: { id: body.id },
          data: { likes: { deleteMany: { userName: session?.user?.name as string } } },
        })
        await tx.notification.deleteMany({ where: { AND: [{ item: { id: body.id } }, { initiator: session.user?.name as string }, { action: 'like' }] } })
        return item
      });


      // SSE Broadcast
      revalidatePath(`/market/${item.item}`, "page")
      return NextResponse.json({ message: "Like deleted successfully" });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: error });
    }
  }
}

export { handler as POST, handler as DELETE, handler as GET };
