import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/ConnectPrisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

        if ( body.parentId.length === 0||body.comment.length === 0 ||body.parentId.length === 0) {
          return NextResponse.json(
            { error: "Invalid comment data" },
            { status: 400 }
          );
        }
        const comment = await prisma.$transaction(async (tx)=>{
          const comment = await tx.comment.create({
            data: {
              createdAt: new Date(Date.now()),
              message: body.comment,
              authorName: session?.user?.name as string,
              parentId: body.parentId,
            },
            
          });
        await tx.comment.update({where:{id: comment.id}, data:{notification:{create:{action:"comment", userInit:{connect:{name: session.user?.name as string}}, userRecip:{connect:{name:comment.authorName}}}}}})
          return comment
        })
      //  SSE Broadcast
        return NextResponse.json(
          { message: "Comment created successfully", comment },
          { status: 200 }
        );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } else if (req.method === "DELETE") {
    const body = await req.json();


    const deletedComment = await prisma.comment.deleteMany({
      where: { AND: [{ id: body }, { children: { none: {} } }] },
    });

    if (deletedComment.count === 0) {
      const deletedCommentUpdate = await prisma.comment.update({
        where: { id: body },
        data: {
          status: "flaggedAsDeleted",
        },
        select: { id: true, status: true },
      });
      if (!deletedComment) {
        return NextResponse.json({ error: "Internal server error" });
      }
      return NextResponse.json({
        message: "Comment deleted successfully",
        deletedCommentUpdate,
      });
    }

    return NextResponse.json({
      message: "Comment deleted successfully",
      deletedComment,
    });
  } else if (req.method === "PATCH") {
    const body = await req.json();
  
    if (!body || body.id.length <= 0 || body.text <= 0) {
      return NextResponse.json({
        error: "Please provide a valid comment update",
      });
    }
    const updatedComment = await prisma.comment.update({
      where: { id: body.id },
      data: { message: body.text, updatedAt: new Date() },
    });
  
    if (!updatedComment) {
      return NextResponse.json({ error: "something went wrong" });
    }
    return NextResponse.json({
      message: "Comment updated successfully",
      updatedComment,
    });
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}

export { handler as POST, handler as PATCH, handler as DELETE };
