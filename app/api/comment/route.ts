import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/ConnectPrisma";

async function handler(req: Request) {
  if (req.method === "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  } else if (req.method === "POST") {
    const session = await getServerSession(options);
    if (!session?.user?.name) {
      return NextResponse.json(
        { error: "You need to be logged in" },
        { status: 401 }
      );
    }
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: "You need to provide comment data" },
        { status: 400 }
      );
    }

    try {
      let text = body.comment;

      if (body.parentId) {
        if (
          typeof body.comment !== "string" ||
          body.comment.length <= 0 ||
          typeof body.parentId !== "string" ||
          body.parentId.length <= 0
        ) {
          return NextResponse.json(
            { error: "Invalid comment data" },
            { status: 400 }
          );
        }
        const comment = await prisma.comment.create({
          data: {
            createdAt: new Date(Date.now()),
            message: text,
            authorName: session.user.name,
            parentId: body.parentId,
          },
        });
        return NextResponse.json(
          { message: "Comment created successfully", comment },
          { status: 200 }
        );
      } else {
        if (
          typeof body.author !== "string" ||
          body.author.length <= 0 ||
          typeof body.comment !== "string" ||
          body.comment.length <= 0 ||
          session.user.name !== body.author ||
          typeof body.event !== "string" ||
          body.event.length <= 0
        ) {
          return NextResponse.json(
            { error: "Invalid comment data" },
            { status: 400 }
          );
        }
        const comment = await prisma.comment.create({
          data: {
            createdAt: new Date(Date.now()),
            message: text,
            authorName: body.author,
            eventId: body.event,
          },
        });
        return NextResponse.json(
          { message: "Comment created successfully", comment },
          { status: 200 }
        );
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } else if (req.method === "DELETE") {
  } else if (req.method === "PATCH") {
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}

export { handler as POST };
