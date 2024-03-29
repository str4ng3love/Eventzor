import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../../../auth/[...nextauth]/options";
import { prisma } from "@/lib/ConnectPrisma";
import { revalidatePath } from "next/cache";
import { triggerNotification } from "@/helpers/eventEmitter";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if (!session?.user?.name)
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  if (req.method === "GET") {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const like = await prisma.like.findFirst({
      where: { AND: [{ userName: session?.user?.name }, { eventId: id }] },
    });

    return NextResponse.json({ like });
  }
  const body = await req.json();
  if (!body)
    return NextResponse.json({ error: "Provide like data" }, { status: 400 });

  if (req.method === "POST") {
    try {
      const comment = await prisma.event.findFirst({
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

      if (comment) {
        return NextResponse.json({ message: "Event already liked" });
      } else {
        const event = await prisma.$transaction(async (tx) => {
          const organizer = await tx.user.findFirst({
            where: {
              events: {
                some: { id: body.id },
              },
            },
          });
          if (!organizer) {
            // need to handle it better
            return;
          }
          const event = await tx.event.update({
            where: { id: body.id },
            data: {
              likes: {
                create: {
                  user: { connect: { name: session.user?.name as string } },
                },
              },
              dislikes: {
                deleteMany: { userName: session.user?.name as string },
              },
            },
            select: {
              organizerName: true,
              title: true,
              id: true,
              likes: {
                where: {
                  AND: [
                    { userName: { equals: session.user?.name as string } },
                    { eventId: body.id },
                  ],
                },
              },
            },
          });

          await tx.notification.create({
            data: {
              targetLike: { connect: { id: event.likes[0].id } },
              action: "like",
              event: { connect: { id: body.id } },
              userRecip: { connect: { name: event.organizerName } },
              userInit: { connect: { name: session.user?.name as string } },
            },
          });

          triggerNotification([organizer.name]);
          return event;
        });
        if (!event?.title) {
          return NextResponse.json({ error: "Something went wrong." });
        }
        // SSE Broadcast
        revalidatePath(`/events/${event?.title}`, "page");
        return NextResponse.json({
          message: "Like created successfully",
        });
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: error });
    }
  }
  if (req.method === "DELETE") {
    try {
      const event = await prisma.$transaction(async (tx) => {
        const event = tx.event.update({
          where: { id: body.id },
          data: {
            likes: { deleteMany: { userName: session?.user?.name as string } },
          },
        });
        await tx.notification.deleteMany({
          where: {
            AND: [
              { eventId: body.id },
              { initiator: session.user?.name as string },
              { action: "like" },
            ],
          },
        });
        return event;
      });

      // SSE Broadcast
      revalidatePath(`/events/${event.title}`, "page");
      return NextResponse.json({ message: "Like deleted successfully" });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: error });
    }
  }
}

export { handler as POST, handler as DELETE, handler as GET };
