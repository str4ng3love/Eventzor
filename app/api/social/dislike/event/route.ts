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

    const dislike = await prisma.dislike.findFirst({
      where: { AND: [{ userName: session?.user?.name }, { commentId: id }] },
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
      const event = await prisma.event.findFirst({
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

      if (event) {
        return NextResponse.json({
          message: "Event already disliked",

        });
      } else {
        const event = await prisma.$transaction(async (tx) => {
          const organizer = await tx.user.findFirst({
            where: {
              events: {
                some: { id: body.id }
              }
            }
          })

          if (!organizer) {
            return
          }
          const event = await tx.event.update({
            where: { id: body.id },
            data: {
              dislikes: {
                create: {
                  user: { connect: { name: session.user?.name as string } },
                },
              },
              likes: { deleteMany: { userName: session.user?.name as string } },
            }, select: { organizerName: true, id: true, dislikes: { where: { AND: [{ userName: { equals: session.user?.name as string } }, { eventId: body.id }] } } }

          })
          await tx.notification.create({ data: { targetDislike: { connect: { id: event.dislikes[0].id } }, action: "dislike", event: { connect: { id: body.id } }, userRecip: { connect: { name: event.organizerName } }, userInit: { connect: { name: session.user?.name as string } } } })

          TriggerNotification([organizer.name])
          return event
        })
        if (!event) {
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
      const event = await prisma.$transaction(async (tx) => {
        const event = tx.event.update({
          where: { id: body.id },
          data: { dislikes: { deleteMany: { userName: session?.user?.name as string } } },
        })
        await tx.notification.deleteMany({ where: { AND: [{ eventId: body.id }, { initiator: session.user?.name as string }, { action: "dislike" }] } })

        return event
      });


      // SSE Broadcast
      revalidatePath(`/events/${event.title}`, 'page')
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
