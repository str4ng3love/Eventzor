import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "./[...nextauth]/options";
export default async function handler(req: Request) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json(
      { message: "You are not logged in." },
      { status: 401 }
    );
  } else {
    return NextResponse.json(session);
  }
}

export { handler as GET };
