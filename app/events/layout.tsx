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
    const {events} = await getNewestEvents()

    return (
        <main className="flex flex-col items-center min-h-screen">
        {/* TODO: [slugified] dynamic page for a single event */}
        <div className="lg:bg-event-hero w-full bg-cover bg-center bg-no-repeat transition-all">
          <EventCarousel
            heading="Newest Events"
            items={events}
            darkBgAlpha={false}
            fullWidthBlur={true}
          />
        </div>

        {/* TODO: Event browser with sorting, pagination etc */}
        {children}
      </main>
    );
}