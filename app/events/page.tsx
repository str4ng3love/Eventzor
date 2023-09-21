import { prisma } from "@/lib/ConnectPrisma";
import EventCarousel from "../components/dynamic/Events/EventCarousel";
import EventsBrowser from "../components/dynamic/Events/EventsBrowser";

const getNewEvents = async () => {
  const newEvents = await prisma.event.findMany({
    orderBy: { eventDate: "asc" },
    take: 10,
  });
  return {
    newEvents,
  };
};
const getEvents = async () => {
  const events = await prisma.event.findMany({
    orderBy: { id: "asc" },
    take: 20,
  });
  return {
    events,
  };
};
const page = async () => {
  const { newEvents } = await getNewEvents();
  const { events } = await getEvents();
  return (
    <main className="flex flex-col items-center min-h-[calc(100dvh_-_4rem)]">
      {/* TODO: [slugified] dynamic page for a single event */}
      <div className="lg:bg-event-hero w-full bg-cover bg-center bg-no-repeat transition-all">
        <EventCarousel heading="Upcoming events" items={newEvents} darkBgAlpha={false} fullWidthBlur={true}/>
      </div>

      {/* TODO: Event browser with sorting, pagination etc */}
      <EventsBrowser events={events} />
    </main>
  );
};

export default page;
