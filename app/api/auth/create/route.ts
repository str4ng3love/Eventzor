import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../lib/ConnectPrisma";
import { hashPass } from "@/lib/bcrypt";

const handler = async (req: Request) => {
  if (req.method !== "POST" && !req.body) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
  const body = await req.json();
  if (!body.username) {
    return NextResponse.json(
      { error: "Please provide a username", field: "username" },
      { status: 400 }
    );
  }
  if (body.username.length <= 2) {
    return NextResponse.json(
      {
        error: "Username should be atleast 3 characters long",
        field: "username",
      },
      { status: 400 }
    );
  }
  if (body.username.match(/[^a-zA-Z0-9]/g)) {
    return NextResponse.json(
      {
        error:
          "No special characters allowed, please use only letters and digits.",
        field: "username",
      },
      { status: 400 }
    );
  }
  if (!body.password) {
    return NextResponse.json(
      { error: "Please provide a password", field: "password" },
      { status: 400 }
    );
  }
  if (body.password.length <= 7) {
    return NextResponse.json(
      {
        error: "Password should be atleast 8 characters long",
        field: "password",
      },
      { status: 400 }
    );
  }
  if (body.password.match(/[^a-zA-Z0-9]/g)) {
    return NextResponse.json(
      {
        error:
          "No special characters allowed, please use only letters and digits.",
        field: "password",
      },
      { status: 400 }
    );
  }
  if (body.password !== body.confirm) {
    return NextResponse.json(
      {
        error: "Please confirm password",
        field: "confirm",
      },
      { status: 400 }
    );
  }
  try {
    const hassedPass = await hashPass(body.password);
    const user = await prisma.user.create({
      data: {
        name: body.username,
        password: hassedPass,
        email: body.email,
      },
    });
    if (!user) {
      return NextResponse.json(
        { message: `Cannot create user` },
        { status: 500 }
      );
    }
    const account = await prisma.account.create({
      data: {
        userId: user.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: user.id,
      },
    });
    if (user && account) {
      return NextResponse.json(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          message: "Account Created",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error);
      if (error.code == "P2002") {
        return NextResponse.json({ error: `Username taken` });
      }

      return NextResponse.json(
        { message: `Internal Server Error` },
        { status: 500 }
      );
    }
  }
};

export { handler as POST, handler as GET };
