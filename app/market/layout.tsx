import { Metadata } from "next";
import { getNewestItems } from "@/helpers/getIItem";
import ItemCarousel from "../components/dynamic/Market/ItemCarousel";
import Footer from "../components/static/Footer";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Eventzor | Market",
  description: "Dashboard Demo",
};
export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { items } = await getNewestItems();

  return (
    <>
      {" "}
      <main className="flex min-h-screen flex-col items-center ">
        <div className="relative w-full bg-cover bg-center bg-no-repeat transition-all before:absolute before:top-0 before:h-full before:w-full before:bg-gradient-radial before:from-slate-900 before:via-transparent before:to-transparent  lg:before:hidden">
          <ItemCarousel
            heading="Newest Items"
            items={items}
            darkBgAlpha={false}
            fullWidthBlur={true}
          />
          <Image
            alt="bacground image"
            src={"/images/hero_item.jpeg"}
            fill
            placeholder="blur"
            blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
            style={{ objectFit: "cover" }}
            sizes="(max-width: 750px) 100dvw"
            className={`-z-10`}
          />
        </div>

        {children}
      </main>
      <Footer />
    </>
  );
}
