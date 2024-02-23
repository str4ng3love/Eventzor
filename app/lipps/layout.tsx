import { Metadata } from "next";
import Footer from "../components/static/Footer";

export const metadata: Metadata = {
  title: "Dashboard Demo | PayGuy",
  description: "Dashboard Demo",
};
export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main
        className={`flex min-h-screenReducedBy6Rem w-full flex-col items-center bg-black/20
       `}
      >
        <h1
          className={`relative z-10 mb-16 mt-32 p-4 text-xl before:absolute before:right-[50%] before:top-[100%] before:flex before:h-20 
        before:w-20 before:-translate-y-2 before:translate-x-[50%] before:-rotate-45 before:items-end before:justify-center before:bg-lips before:bg-cover 
        before:bg-center before:text-base before:content-["L.I.P.P.S."]`}
        >
          Welcome to Let&apos;s Imagine Paying Payment System
        </h1>
        <div className="z-10  ">{children}</div>
      </main>
      <Footer />
    </>
  );
}
