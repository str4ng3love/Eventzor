import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "@/lib/bcrypt";

const prisma = new PrismaClient();

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          label: "UserName",
          type: "text",
          placeholder: "username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials, req) {
        let user = await prisma.user.findFirst({
          where: { name: credentials?.username },
        });

        if (user && credentials?.password) {
          const isMatch = await compare(credentials?.password, user.password)

          if (isMatch) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {},
  session: {
    strategy: "jwt",
  },
};
