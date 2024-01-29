import { Metadata } from "next";
import EventCarousel from "../components/dynamic/Events/EventCarousel";
import { getNewestEvents } from "@/helpers/getEvent";


export const metadata: Metadata = {
  title: "Dashboard Demo | Events",
  description: "Dashboard Demo",
};
export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { events } = await getNewestEvents()

  return (
    <main className="flex flex-col items-center min-h-screen">

      <div className="bg-event-hero relative lg:before:hidden before:absolute before:top-0 before:bg-gradient-radial before:to-transparent before:via-transparent before:h-full before:w-full before:from-slate-900 w-full bg-cover bg-center bg-no-repeat transition-all">
        <EventCarousel
          heading="Newest Events"
          items={events}
          darkBgAlpha={false}
          fullWidthBlur={true}
        />
      </div>



      {children}

    </main>
  );
}