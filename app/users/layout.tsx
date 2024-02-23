import { Metadata } from "next";
import Footer from "../components/static/Footer";

export const metadata: Metadata = {
  title: "Dashboard Demo | Users",
  description: "Dashboard Demo",
};
export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex min-h-screenReducedBy6Rem flex-col items-center">
        {children}
      </main>
      <Footer />
    </>
  );
}
