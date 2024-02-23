import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../../../auth/[...nextauth]/options";
import { prisma } from "@/lib/ConnectPrisma";
import { triggerNotification } from "@/helpers/eventEmitter";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if (!session?.user?.name)
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  if (req.method === "GET") {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const like = await prisma.like.findFirst({
      where: { AND: [{ userName: session?.user?.name }, { commentId: id }] },
    });

    return NextResponse.json({ like });
  }
  const body = await req.json();
  if (!body)
    return NextResponse.json({ error: "Provide like data" }, { status: 400 });

  if (req.method === "POST") {
    try {
      const comment = await prisma.comment.findFirst({
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
        return NextResponse.json({ message: "Comment already liked" });
      } else {
        const comment = await prisma.$transaction(async (tx) => {
          const commenter = await tx.comment.findFirst({
            where: {
              id: body.id,
            },
          });

          if (!commenter) {
            // need to handle it better
            return;
          }
          const comment = await tx.comment.update({
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
              authorName: true,
              id: true,
              likes: {
                where: {
                  AND: [
                    { userName: { equals: session.user?.name as string } },
                    { commentId: body.id },
                  ],
                },
              },
            },
          });

          await tx.notification.create({
            data: {
              targetLike: { connect: { id: comment.likes[0].id } },
              action: "like",
              comment: { connect: { id: body.id } },
              userRecip: { connect: { name: comment.authorName } },
              userInit: { connect: { name: session.user?.name as string } },
            },
          });

          triggerNotification([commenter.authorName]);
          return comment;
        });
        if (!comment) {
          return NextResponse.json({ error: "Something went wrong." });
        }
        // SSE Broadcast

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
      const comment = await prisma.$transaction(async (tx) => {
        const comment = await tx.comment.update({
          where: { id: body.id },
          data: {
            likes: { deleteMany: { userName: session?.user?.name as string } },
          },
        });
        await tx.notification.deleteMany({
          where: {
            AND: [
              { comment: { id: body.id } },
              { initiator: session.user?.name as string },
              { action: "like" },
            ],
          },
        });

        return comment;
      });

      return NextResponse.json({ message: "Like deleted successfully" });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: error });
    }
  }
}

export { handler as POST, handler as DELETE, handler as GET };
