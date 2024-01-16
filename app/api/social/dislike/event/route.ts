import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../../../auth/[...nextauth]/options";
import { prisma } from "@/lib/ConnectPrisma";
import { revalidatePath } from "next/cache";
import { ObjectId } from "bson";
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
          const notification = await tx.notification.findFirst({ where: { eventId: body.id }, select: { id: true } })
          const randomId = new ObjectId().toString()

          if (!organizer) {
            return
          }
          const event = await tx.event.update({
            where: { id: body.id },
            data: {
              notification: {
                upsert: { where: { id: notification ? notification.id : randomId }, update: { markedAsDeleted: false }, create: { action: "dislike", userInit: { connect: { name: session.user?.name as string } }, userRecip: { connect: { name: organizer.name } } } }
              },
              dislikes: {
                create: {
                  user: { connect: { name: session.user?.name as string } },
                },
              },
              likes: { deleteMany: { userName: session.user?.name as string } },
            }, select: { organizerName: true, title: true }
          })

          return event
        })
        if (!event?.title) {
          return NextResponse.json({ error: "Something went wrong." })
        }
        // SSE Broadcast
        revalidatePath(`/events/${event?.title}`, "page")
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
        await tx.notification.updateMany({ where: { AND: [{ eventId: body.id }, { initiator: session.user?.name as string }, {action: "dislike"}] }, data: { markedAsDeleted: true } })
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
