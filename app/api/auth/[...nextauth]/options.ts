import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";


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
          where: { username: credentials?.username, AND: {password: credentials?.password} },
        });

        if (user?.username) {
 
          return user
        }
        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    
  },
  session: {
    strategy:"jwt"
  }
};
