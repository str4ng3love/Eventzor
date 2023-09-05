import { prisma } from "@/lib/ConnectPrisma";
import Carousel from "../components/dynamic/Carousel";
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
    orderBy:{id:'asc'},
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
      <Carousel heading="Upcoming events" items={newEvents} />
      {/* TODO: Event browser with sorting, pagination etc */}
      <EventsBrowser events={events} />
    </main>
  );
};

export default page;
