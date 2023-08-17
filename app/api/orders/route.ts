import { options } from "../auth/[...nextauth]/options";
import { prisma } from "../../../lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  if (req.method === "POST") {
    
    const session = await getServerSession(options);
    if (session?.user?.name) {
      const body = await req.json();
     
      if (
        body.amount <= 0 ||
        body.description.length < 3 ||
        typeof body.description !== "string" ||
        body.item < 3 ||
        typeof body.item !== "string" ||
        typeof body.isBuyOrder !== "boolean" ||
        typeof body.isPreorder !== "boolean" || body.price.length ===0 || parseInt(body.price) < 0
      ) {
        return NextResponse.json(
          { error: "Please provide correct/missing values" },
          { status: 200 }
        );
      }

      try {
        const newOrder = await prisma.order.create({
          data: {
            amount: body.amount,
            description: body.description,
            item: body.item,
            isBuyOrder: body.isBuyOrder,
            merchantName: session?.user?.name,
            preorder: body.isPreorder,
            releaseDate: body.releaseDate,
            price: body.price
          },
        });

        if (newOrder) {
          return NextResponse.json(
            { message: "Order created successfully" },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { error: "Could not create the order" },
            { status: 200 }
          );
        }
      } catch (error) {}
    } else {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }
  } else {
    try {
      const orders = await prisma.order.findMany({});
      if (!orders) {
        return NextResponse.json(
          { error: "Something went wrong" },
          { status: 400 }
        );
      } else if (orders.length === 0) {
        return NextResponse.json(
          { message: "No orders found." },
          { status: 404 }
        );
      } else {
        return NextResponse.json(orders);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Internal server problem" },
        { status: 500 }
      );
    }
  }
}

export { handler as GET, handler as POST };
