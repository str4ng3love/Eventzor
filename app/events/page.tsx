import { prisma } from "@/lib/ConnectPrisma";
import Carousel from "../components/dynamic/Carousel";

const getNewEvents = async () => {
  const newEvents = await prisma.event.findMany({
    where: {

    },
    select: {
      eventDate: true,
      location: true,
      price: true,
      title: true,
      closingDate: true,
      images: true,
      tickets: true,
      ticketsSold: true,
    },
  });
  return {
    newEvents
  }
};

const page = async () => {
    const {newEvents} = await getNewEvents();
  return (
    <main className="flex flex-col items-center min-h-[calc(100dvh_-_4rem)]">
      {/* TODO: [slugified] dynamic page for a single event */}
      <Carousel
        heading="Upcoming events"
        items={newEvents}
      />
      {/* TODO: Event browser with sorting, pagination etc */}
      <div>newest sellers carrousel?</div>
      <div>event browser</div>
    </main>
  );
};

export default page;
