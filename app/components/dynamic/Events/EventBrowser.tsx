import AddNewEvent from "./AddNewEvent";
import { prisma } from "../../../../lib/ConnectPrisma";
const getEvents = async () => {
  const events = await prisma.event.findMany();
  return {
    events,
    revalidate: 60,
  };
};

const EventBrowser = async () => {
  const { events } = await getEvents();
  return (
    <>
      <div className="my-4 px-8 flex flex-col">
        <div className="flex justify-end">
        {/* todo filter component and sort */}
        <AddNewEvent />
        </div>
      
      <table className="my-8 bg-black w-full">
        <tbody>
          <tr className="border-b-2 border-primary">
            <th className="p-2 text-start">Event</th>
            <th className="p-2 text-start">Date</th>
            <th className="p-2 text-start">Location</th>
            <th className="p-2 text-start">Tickets Remaining</th>
            <th className="p-2 text-start">Closing Date</th>
            <th className="p-2 text-start"> </th>
          </tr>
          {events.map((event) => (
            <tr className="border-b-2 border-primary">
              <td className="p-2">
                {event.title} <br /> {event.location}
              </td>
              <td className="p-2">{event.startDate.toDateString()} <br/> {event.startDate.toTimeString().slice(0, 5)}</td>
              <td className="p-2">{event.location}</td>
              <td className="p-2">
                {event.tickets - event.ticketsSold} / {event.tickets}
              </td>
              <td className="p-2">{event.endDate.toDateString()}</td>
              <td>menu</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
};

export default EventBrowser;
