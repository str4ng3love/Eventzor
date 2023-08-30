import { prisma } from "@/lib/ConnectPrisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";



async function handler(req: Request, { params }: { params: { slug: string } }) {
    const slug = params.slug;
    try {
      const event = await prisma.event.findUnique({ where: { id: slug }, select: {title:true, id:true , price:true} });

      if (!event) {
        return NextResponse.json(
          { error: `No event with id of ${slug}` },
          { status: 404 }
        );
      }
  
      return NextResponse.json(event);
    } catch (error) {
      console.log(error);
      if(error instanceof PrismaClientKnownRequestError){
          return NextResponse.json(
                  { error: `Prisma client error, code: ${error.code}. ${error.message.toString().replaceAll('\n', '')}`},   
                );
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
  
  export { handler as GET };
  