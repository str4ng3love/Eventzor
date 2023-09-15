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
    return NextResponse.json({ error: "Provide like data" }, { status: 400 });

  if (req.method === "POST") {
    try {
      const comment = await prisma.comment.findFirst({
        where: {
          AND: [
            { id: body.id },
            {
              likes: {
                some: { user: { username: session.user?.name as string } },
              },
            },
          ],
        },
      });

      if (comment) {
        return NextResponse.json({ message: "Comment already liked"});
      } else {
        const like = await prisma.comment.update({
          where: { id: body.id },
          data: {
            likes: {
              create: {
                user: { connect: { name: session.user?.name as string } },
              },
            }, dislikes:{deleteMany:{userName:session.user.name}}
          },
        });
        return NextResponse.json({
          message: "Like created successfully",
          like,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  if (req.method === "DELETE") {
    try {
      const like = await prisma.comment.update({
        where: { id: body.id },
        data: { likes: { deleteMany: { userName: session.user.name } } },
      });

      return NextResponse.json({ message: "Like deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  }
}

export { handler as POST, handler as DELETE, handler as GET };
