import EventBrowser from "@/app/components/dynamic/Events/EventBrowser";
import { Heading2, Heading4 } from "@/app/components/static/Heading";
import { prisma } from "../../../lib/ConnectPrisma";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";


const getEvents = async () => {
  const session = await getServerSession(options);

  const events = await prisma.event.findMany({ where:{
    organizerName: session?.user?.name as string
  },orderBy: [{ title: "asc" }] });
  return {
    events,
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
