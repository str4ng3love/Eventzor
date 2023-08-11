import EventBrowser from "@/app/components/dynamic/Events/EventBrowser";
import { Heading2, Heading4 } from "@/app/components/static/Heading";
import { prisma } from "../../../lib/ConnectPrisma";
const getEvents = async () => {
  const events = await prisma.event.findMany({ orderBy: [{ title: "asc" }] });
  return {
    events,
    revalidate: 60,
  };
};
const page = async () => {
  const { events } = await getEvents();
  return (
    <>
      <div className="flex flex-col pl-10">
        <Heading2 text="events" />
        <Heading4 text="Browse and manage events" />
      </div>
      <EventBrowser events={events} />
    </>
  );
};

export default page;
