import { Metadata } from "next";
import EventCarousel from "../components/dynamic/Events/EventCarousel";
import { getNewestEvents } from "@/helpers/getEvent";
import Footer from "../components/static/Footer";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Eventzor | Events",
};
export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { events } = await getNewestEvents();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center">
        <div className="relative w-full bg-cover bg-center bg-no-repeat transition-all before:absolute before:top-0 before:h-full before:w-full before:bg-gradient-radial before:from-slate-900 before:via-transparent before:to-transparent lg:before:hidden">
          <EventCarousel
            heading="Newest Events"
            items={events}
            darkBgAlpha={false}
            fullWidthBlur={true}
          />
          <Image
            alt="background image"
            src={"/images/hero_event.jpeg"}
            fill
            placeholder="blur"
            blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
            style={{ objectFit: "cover" }}
            sizes="(max-width: 750px"
            className={`-z-10`}
          />
        </div>
        {children}
      </main>
      <Footer />
    </>
  );
}
