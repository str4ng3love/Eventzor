import { NextResponse } from "next/server";

async function handler(req: Request) {
  return NextResponse.json({ message: "test" });
}

export { handler as GET };
