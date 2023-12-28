import { prisma } from "@/lib/ConnectPrisma";
import EventCarousel from "../components/dynamic/Events/EventCarousel";
import EventsBrowser from "../components/dynamic/Events/EventsBrowser";
import Button from "../components/dynamic/Button";

const getNewEvents = async () => {
  const newEvents = await prisma.event.findMany({
    orderBy: { eventDate: "asc" },
    take: 10,
    where:{images:{isEmpty:false}}
  });
  return {
    newEvents,
  };
};
const getEvents = async () => {
  const events = await prisma.event.findMany({
    orderBy: { id: "asc" },
    take: 20,
    where:{images:{isEmpty:false}}
  });
  return {
    events,
  };
};
const page = async () => {
  const { newEvents } = await getNewEvents();
  const { events } = await getEvents();
  if (events.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="font-bold text-xl mb-12">There are no Events in the DB</h1>
        <Button title="go to home" text="go to Home" link="/"/>
      </div>
    );
  } else {
    return (
      <main className="flex flex-col items-center h-screen">
        {/* TODO: [slugified] dynamic page for a single event */}
        <div className="lg:bg-event-hero w-full bg-cover bg-center bg-no-repeat transition-all">
          <EventCarousel
            heading="Newest Events"
            items={newEvents}
            darkBgAlpha={false}
            fullWidthBlur={true}
          />
        </div>

        {/* TODO: Event browser with sorting, pagination etc */}
        <EventsBrowser events={events} />
      </main>
    );
  }
};

export default page;
