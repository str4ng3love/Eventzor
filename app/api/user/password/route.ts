import { prisma } from "@/lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { compare, hashPass } from "@/lib/bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

async function handler(req: Request) {
  const body = await req.json();

  const session = await getServerSession(options);
  if (!session?.user?.name) {
    return NextResponse.json({ error: "Not authorized" });
  }
  if (!body.password || !body.newPassword || !body.confirmPassword) {
    return NextResponse.json({
      error: "Please provide password, newPassword and confirmPassword fields",
    });
  }
  if (body.newPassword.length <= 7) {
    return NextResponse.json({
      error: "Password should be atleast 8 characters long",
    });
  }
  if (body.newPassword.match(/[^a-zA-Z0-9]/g)) {
    return NextResponse.json({
      error:
        "No special characters allowed, please use only letters and digits.",
    });
  }
  if (body.newPassword !== body.confirmPassword) {
    return NextResponse.json({
      error: "Please confirm password",
    });
  }

  try {
    const newPassword = await prisma.$transaction(async (tx) => {
      const password = await tx.user.findUnique({
        where: { name: session.user?.name as string },
        select: { password: true },
      });
      const isMatch = await compare(
        body.password,
        password?.password as string,
      );
      console.log(isMatch);
      if (!isMatch) {
        return NextResponse.json({ error: "Wrong password" });
      }
      const hashNewPass = await hashPass(body.newPassword);
      const newPassword = await tx.user.update({
        where: { name: session.user?.name as string },
        data: { password: hashNewPass },
      });
      return newPassword;
    });

    if (newPassword) {
      return NextResponse.json({ message: "Password updated" });
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Wrong password" });
      }
    }
    console.log(error);
    return NextResponse.json({ error: "Internal server error" });
  }
}

export { handler as POST };
