

import { NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/ConnectPrisma";
async function handler(req: Request) {
  if (req.method === "PATCH") {
    const session = await getServerSession(options);
    if (session?.user?.name) {
      const body = await req.json();
      if (!body) {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
      }
      const imagesArr = [...new Set(body.images)]


      const updatedEventImages = await prisma.marketItem.update({
        where: {
          id: body.id,
        },data:{
            images: imagesArr as string[]
        }
      });
      if(!updatedEventImages){
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      } else {
        return NextResponse.json({message: 'Images updated successfully'});
      }
    } else {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
  } else {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export {handler as PATCH}