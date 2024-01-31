import { Metadata } from "next";
import Footer from "../components/static/Footer";


export const metadata: Metadata = {
  title: "Eventzor",
  description: "",
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