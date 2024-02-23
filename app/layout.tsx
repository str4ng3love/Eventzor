import "./globals.css";
import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import Header from "./components/static/Header/Header";
import { getServerSession } from "next-auth";
import SessionProvider from "./components/SessionProvider";

const publicSans = Public_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eventzor",
  description: "Post and find all kinds of events.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <head></head>
      <body className={`${publicSans.className} relative`}>
        <SessionProvider session={session}>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
