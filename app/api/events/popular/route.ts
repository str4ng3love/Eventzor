import { prisma } from "@/lib/ConnectPrisma";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  if (req.method === "GET") {
    const { searchParams } = new URL(req.url);
    const skip = searchParams.get("skip");
    const take = searchParams.get("take");
 

    try {
      const events = await prisma.event.findMany({
        
        orderBy: { ticketsSold: 'desc' },
        skip: skip ? parseInt(skip) : 0,
        take: take ? parseInt(take) : 20,
      });
      if(events){
        return NextResponse.json(events)
      } else {
        return NextResponse.json({error: 'Something went wrong'})
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export { handler as GET };
