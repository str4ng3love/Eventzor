import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if (req.method == "POST") {
    if (session?.user?.name) {
      const body = await req.json();
      if (
        typeof body.title != "string" ||
        body.title.length < 3 ||
        typeof body.description != "string" ||
        body.description.length < 3 ||
        typeof body.location != "string" ||
        body.location.length < 3 ||
        body.tickets.length < 0 ||
        !body.eventDate ||
        !body.closingDate||
        parseFloat(body.price) <= 0 ||
        parseInt(body.tickets)  <= 0||
        body.image.length <= 0
      ) {
        return NextResponse.json(
          { error: "Please provide correct/missing values" },
          { status: 200 }
        );
      }
      try {
        const event = await prisma.event.create({
          data: {
            title: body.title,
            description: body.description,
            location: body.location,
            tickets: parseInt(body.tickets),
            eventDate: new Date(body.eventDate),
            closingDate: new Date(body.closingDate),
            organizerName: session.user.name,
            price: parseFloat(body.price),
            images: [body.image]

          },
        });
        if (event) {
          return NextResponse.json(
            { message: "Event created successfully" },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { error: "Could not create the event" },
            { status: 200 }
          );
        }
      } catch (error) {
        console.log(error)
        return NextResponse.json(
          { error: "Server Internal Error" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }
  } else if (req.method == "DELETE") {
    if (!session?.user?.name) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    try {
      const body = await req.json();
      const deletedEvent = await prisma.event.delete({
        where: {
          id: body.id,
          organizerName: session.user.name
        },
      });
      if (!deletedEvent) {
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
      return NextResponse.json({ message: "Event deleted successfully" });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } else if (req.method == "PATCH"){
    if (!session?.user?.name) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }
    const body = await req.json();
  if(parseInt(body.state.tickets) <= 0){
    return NextResponse.json({error: "Amount of tickets must be higher than 0"})
  }
    try {

      const updatedEvent = await prisma.event.update({where:{id: body.id, organizerName:session.user.name}, data:{title: body.state.title, description: body.state.description, location: body.state.location, eventDate: body.state.eventDate, closingDate:body.state.closingDate, status:body.state.status, tickets: parseInt(body.state.tickets)}});
      if (!updatedEvent) {
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
      return NextResponse.json({ message: "Event edited successfully" });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      console.log(error)
      return NextResponse.json(
        { error: "Internal server error, here?" },
        { status: 500 }
      );
    }
  } else {
    const events = await prisma.event.findMany();
    if (events) {
      return NextResponse.json(events);
    } else {
      return NextResponse.json({error: 'Something went wrong.'})
    }
  }
}

export { handler as GET, handler as POST, handler as DELETE, handler as PATCH };
