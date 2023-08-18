import { options } from "../auth/[...nextauth]/options";
import { prisma } from "../../../lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if (req.method === "POST") {
    if (session?.user?.name) {
      const body = await req.json();

      if (
        body.amount <= 0 ||
        body.description.length < 3 ||
        typeof body.description !== "string" ||
        body.item < 3 ||
        typeof body.item !== "string" ||
        typeof body.isBuyOrder !== "boolean" ||
        typeof body.isPreorder !== "boolean" ||
        body.price.length === 0 ||
        parseInt(body.price) < 0
      ) {
        return NextResponse.json(
          { error: "Please provide correct/missing values" },
          { status: 200 }
        );
      }
      try {
        const newOrder = await prisma.order.create({
          data: {
            amount: parseInt(body.amount),
            description: body.description,
            item: body.item,
            isBuyOrder: body.isBuyOrder,
            merchantName: session?.user?.name,
            preorder: body.isPreorder,
            releaseDate: body.releaseDate,
            price: parseInt(body.price),
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
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }
  } else if (req.method === "DELETE") {
    if (session?.user?.name) {
      const body = await req.json();
      if (!body.id) {
        return NextResponse.json({ error: "Please provide order ID" });
      }
      try {
        const deletedOrder = await prisma.order.delete({
          where: { id: body.id },
        });
        if (!deletedOrder) {
          return NextResponse.json(
            { error: "Order not found" },
            { status: 404 }
          );
        } else {
          return NextResponse.json({ message: "Order deleted successfull" });
        }
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
  } else if (req.method === "PATCH") {
    if (session?.user?.name) {
      const body = await req.json();
      if (!body) {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
      }
    if(parseInt(body.state.price) <= 0){
      return NextResponse.json({error: "Price cannot be lower or equal 0"})
    }
    if(parseInt(body.state.amount) <= 0){
      return NextResponse.json({error: "Amount cannot be lower or equal 0"})
    }
    if(parseInt(body.state.amount) > 10000){
      return NextResponse.json({error: "Amount of items cannot exceed 10 000 units"})
    }
    console.log(body)
      try {
        const updatedOrder = await prisma.order.update({
          where: {
            id: body.id,
          },
          data: {
           amount: parseInt(body.state.amount),
           price: parseInt(body.state.price),
           description: body.state.description,
           item: body.state.item
            
          },
        });
        if (!updatedOrder) {
          return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
          );
        }
        return NextResponse.json({ message: "Order updated successfully" });
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
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

export { handler as GET, handler as POST, handler as DELETE, handler as PATCH };
