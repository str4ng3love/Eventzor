
import "./globals.css";
import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import Header from "./components/static/Header/Header";
import { getServerSession } from "next-auth";
import SessionProvider from "./components/SessionProvider";


const publicSans = Public_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard Demo",
  description: "Dashboard Demo",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={`${publicSans.className} min-w-[675px]`}>
        <SessionProvider session={session}>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
