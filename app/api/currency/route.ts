import { prisma } from "@/lib/ConnectPrisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  if (req.method === "GET") {
    const { searchParams } = new URL(req.url);
    const value = searchParams.get("currency");
    if (!value) {
      const currencies = await prisma.currency.findMany({});
      if (currencies.length == 0) {
        return NextResponse.json({ error: "Nothing found" });
      } else {
        return NextResponse.json(currencies);
      }
    } else
      try {
        const currency = await prisma.currency.findFirst({
          where: { name: value.toLowerCase() },
        });
        if (!currency) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        } else {
          return NextResponse.json({ currency });
        }
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          console.log(error);
          return NextResponse.json({ error: "Bad request" }, { status: 400 });
        } else {
          console.log(error);
          return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
          );
        }
      }
  }
  else {
    return NextResponse.json(
      { error: "Methond not supported" },
      { status: 405 }
    );
  }
}
export { handler as GET, handler as POST, handler as PATCH };
