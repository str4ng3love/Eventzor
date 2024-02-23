import { prisma } from "@/lib/ConnectPrisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

async function handler(req: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  try {
    const item = await prisma.marketItem.findUnique({ where: { id: slug } });
    if (!item) {
      return NextResponse.json(
        { error: `No item with id of ${slug}` },
        { status: 404 },
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json({
        error: `Prisma client error, code: ${error.code}. ${error.message.toString().replaceAll("\n", "")}`,
      });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export { handler as GET };
