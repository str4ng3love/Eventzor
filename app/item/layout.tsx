import Footer from "@/app/components/static/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventzor",
};
export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
