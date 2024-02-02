import { Metadata } from "next";
import EventCarousel from "../components/dynamic/Events/EventCarousel";
import { getNewestEvents } from "@/helpers/getEvent";
import Footer from "../components/static/Footer";
import Image from "next/image";


export const metadata: Metadata = {
  title: "Eventzor | Events",
  description: "",
};
export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { events } = await getNewestEvents()

  return (
    <>
      <main className="flex flex-col items-center min-h-screen">

        <div className="relative lg:before:hidden before:absolute before:top-0 before:bg-gradient-radial before:to-transparent before:via-transparent before:h-full before:w-full before:from-slate-900 w-full bg-cover bg-center bg-no-repeat transition-all">
          <EventCarousel
            heading="Newest Events"
            items={events}
            darkBgAlpha={false}
            fullWidthBlur={true}
          />
          <Image
            alt="bacground image"
            src={'/images/hero_event.jpeg'}
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