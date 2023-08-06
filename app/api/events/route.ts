import { NextResponse } from "next/server";
import { prisma } from "../../../lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

async function handler(req: Request) {
  if (req.method == "POST") {
    const session = await getServerSession(options);
    if (session?.user?.name) {
      const body = await req.json();

      if (
        typeof body.title != "string" ||
        body.title.length < 3 ||
        typeof body.description != "string" ||
        body.description.length < 3 ||
        typeof body.location != "string" ||
        body.location.length < 3 ||
        typeof body.tickets != "string" ||
        body.tickets.length < 0 ||
        typeof body.startDate != "string" ||
        body.startDate.length < 0 ||
        typeof body.endDate != "string" ||
        body.endDate.length < 0
      ) {
        return NextResponse.json(
          { error: "Please provide correct/missing values" },
          { status: 200 }
        );
      }
      const event = await prisma.event.create({
        data: {
          title: body.title,
          description: body.description,
          location: body.location,
          tickets: parseInt(body.tickets),
          startDate:new Date(body.startDate),
          endDate:new Date(body.endDate),
          organizerName: session.user.name,
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
    }
  } else {
    const events = await prisma.event.findMany()
    

    if (events) {
      return NextResponse.json(events);
    }
  }
}

export { handler as GET, handler as POST };
