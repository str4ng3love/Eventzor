import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  if (!path) {
    return NextResponse.json(
      { message: "Missing path param" },
      { status: 400 },
    );
  }
  console.log(path);
  revalidatePath(path);
  return NextResponse.json({ path, revalidated: true, now: Date.now() });
}

export { handler as POST };
