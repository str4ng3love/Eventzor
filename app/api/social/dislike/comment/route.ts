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
    return NextResponse.json(
      { error: "Provide dislike data" },
      { status: 400 },
    );

  if (req.method === "POST") {
    try {
      const comment = await prisma.comment.findFirst({
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
      if (comment) {
        return NextResponse.json({ message: "Comment already disliked" });
      } else {
        const comment = await prisma.$transaction(async (tx) => {
          const commenter = await tx.comment.findFirst({
            where: {
              id: body.id,
            },
          });

          if (!commenter) {
            return;
          }
          const comment = await tx.comment.update({
            where: { id: body.id },
            data: {
              dislikes: {
                create: {
                  user: { connect: { name: session.user?.name as string } },
                },
              },
              likes: { deleteMany: { userName: session.user?.name as string } },
            },
            select: {
              authorName: true,
              id: true,
              dislikes: {
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
              targetDislike: { connect: { id: comment.dislikes[0].id } },
              action: "dislike",
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
          message: "Dislike created successfully",
        });
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 },
      );
    }
  }
  if (req.method === "DELETE") {
    try {
      await prisma.$transaction(async (tx) => {
        tx.comment.update({
          where: { id: body.id },
          data: {
            dislikes: {
              deleteMany: { userName: session?.user?.name as string },
            },
          },
        });

        await tx.notification.deleteMany({
          where: {
            AND: [
              { comment: { id: body.id } },
              { initiator: session.user?.name as string },
              { action: "dislike" },
            ],
          },
        });
        return;
      });

      return NextResponse.json({ message: "Disike deleted successfully" });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 },
      );
    }
  }
}

export { handler as POST, handler as DELETE, handler as GET };
