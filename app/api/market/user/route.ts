import { options } from "../../auth/[...nextauth]/options";
import { prisma } from "@/lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  const session = await getServerSession(options);
let regex = /[#]/g
  if (session?.user?.name) {
    if (req.method === "GET") {
      try {
        const items = await prisma.marketItem.findMany({
          where: { merchantName: session.user.name },
        });
        return NextResponse.json( items );
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    } else if (req.method === "POST") {
      const body = await req.json();

      if (
        body.amount <= 0 ||
        body.description.length < 3 ||
        typeof body.description !== "string" ||
        body.item.length <= 3 ||
        typeof body.item !== "string" ||
        typeof body.isPreorder !== "boolean" ||
        body.price.length === 0 ||
        parseFloat(body.price) < 0 ||
        typeof body.type !== "string" ||
        body.type.length === 0
      ) {
        return NextResponse.json(
          { error: "Please provide correct/missing values" },
          { status: 200 }
        );
      }
      let test = regex.test(body.item)
      if(test){
        return NextResponse.json(
          { error: `Item cannot use reserved character '#"` },
          { status: 200 }
        );
      }
      try {
        const newItem = await prisma.marketItem.create({
          data: {
            amount: parseInt(body.amount),
            description: body.description,
            item: body.item.trim(),
            itemType: body.type,
            merchantName: session?.user?.name,
            preorder: body.isPreorder,
            releaseDate: body.isPreorder ? new Date(body.releaseDate) : null,
            price: parseFloat(body.price),
          },
        });

        if (newItem) {
          return NextResponse.json(
            { message: "Item created successfully" },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { error: "Could not create new item" },
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
      const body = await req.json();
      if (!body.id) {
        return NextResponse.json({ error: "Please provide item ID" });
      }
      try {
        const deletedItem = await prisma.marketItem.delete({
          where: { id: body.id, merchantName: session.user.name },
        });
        if (!deletedItem) {
          return NextResponse.json(
            { error: "Item not found" },
            { status: 404 }
          );
        } else {
          return NextResponse.json({ message: "Item deleted successfull" });
        }
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    } else if (req.method === "PATCH") {
      const body = await req.json();
      if (!body) {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
      }
      if (parseInt(body.price) <= 0) {
        return NextResponse.json({ error: "Price cannot be lower or equal 0" });
      }
      if (parseInt(body.amount) <= 0) {
        return NextResponse.json({
          error: "Amount cannot be lower or equal 0",
        });
      }
      if (parseInt(body.amount) > 10000) {
        return NextResponse.json({
          error: "Amount of items cannot exceed 10 000 units",
        });
      }
      let test = regex.test(body.item)
   
      if(test){
        return NextResponse.json(
          { error: `Title cannot use reserved character '#"` },
          { status: 200 }
        );
      }
      try {
       
        const updatedItem = await prisma.marketItem.update({
          where: {
            id: body.id,
          },
          data: {
            amount: parseInt(body.amount),
            price: parseFloat(body.price),
            // type: body.type,
            description: body.description,
            preorder: body.isPreorder,
            item: body.item.trim(),
            releaseDate: body.isPreorder ? body.releaseDate : null,
          },
        });
        if (!updatedItem) {
          return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
          );
        }
   
        return NextResponse.json({ message: "Item updated successfully" });
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    } else {
      try {
        const items = await prisma.marketItem.findMany({});
        if (!items) {
          return NextResponse.json(
            { error: "Something went wrong" },
            { status: 400 }
          );
        } else if (items.length === 0) {
          return NextResponse.json(
            { message: "No items found." },
            { status: 404 }
          );
        } else {
          return NextResponse.json(items);
        }
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Internal server problem" },
          { status: 500 }
        );
      }
    }
  } else {
    return NextResponse.json({ error: "Unathorized" }, { status: 401 });
  }
}

export { handler as GET, handler as POST, handler as DELETE, handler as PATCH };
