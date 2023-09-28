import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../../../auth/[...nextauth]/options";
import { prisma } from "@/lib/ConnectPrisma";
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
      { status: 400 }
    );

  if (req.method === "POST") {
    try {
      const comment = await prisma.event.findFirst({
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

      if (comment) {
        return NextResponse.json({
          message: "Comment already disliked",
 
        });
      } else {
        const dislike = await prisma.event.update({
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
      const dislike = await prisma.event.update({
        where: { id: body.id },
        data: { dislikes: { deleteMany: { userName: session.user.name } } },
      });

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
