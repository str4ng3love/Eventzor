import { prisma } from "@/lib/ConnectPrisma";
import { NextResponse } from "next/server";

async function handler(req: Request) {

  if (req.method === "GET") {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    console.log(query)
    let queryResponse = {}
    if (typeof query === "string") {
      try {
        const users = await prisma.user.findMany({ where: { name: {contains: query, mode:"insensitive"} }, select: {id: true, name: true } });
        Object.assign(queryResponse,{users}) 
      } catch (error) {
        console.log(error);
      }
      try {
        const events = await prisma.event.findMany({ where: { title:{contains: query, mode:"insensitive"} }, select: {id: true, title: true } });
        Object.assign(queryResponse,{events}) 
      } catch (error) {
        console.log(error);
      }
      try {
        const orders = await prisma.marketItem.findMany({ where: { item: {contains: query, mode:"insensitive"} }, select: {id: true, item: true } });
        Object.assign(queryResponse,{orders}) 
        console.log(queryResponse)
      } catch (error) {
        console.log(error);
      }
      

      return NextResponse.json(queryResponse)
    } else {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}

export { handler as GET };
