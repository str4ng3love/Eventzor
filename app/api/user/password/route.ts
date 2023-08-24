import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { prisma } from "@/lib/ConnectPrisma";
import { hashPass } from "@/lib/bcrypt";
import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

async function handler(req: Request) {
  if (req.method === "POST") {
    const session = await getServerSession(options);

    if (session?.user?.name) {
      const body = await req.json();
      if (body.newPassword !== body.confirmPassword) {
        return NextResponse.json(
          { error: `Please Confirm Password` },
          { status: 404 }
        );
      }
      if (body.newPassword.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters long" },
          { status: 404 }
        );
      }
      const hashedPassword = await hashPass(body.password);
      const hashedNewPassword = await hashPass(body.newPassword);
      try {
        const resp = await prisma.user.update({
          where: {
            name: session.user.name,
            password: hashedPassword,
          },
          data: {
            password: hashedNewPassword,
          },
        });
          if(resp.id){
            return NextResponse.json(
              { message: "Password changed successfully." },
              { status: 401 }
              );
            }
       
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if(error?.meta?.cause?.toString().includes('not found')){
            return NextResponse.json({
              error: "Provided password doesn't match current password"
            });
          }
       
        }
      }
    } else {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
  } else {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export { handler as POST };
