import AddNewEvent from "./AddNewEvent";
import { prisma } from "../../../../lib/ConnectPrisma";
import SortEvents from "./SortEvents";
import FilterEventsByDate from "./FilterEventsByDate";
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
        <div className="flex justify-end gap-4">
          {/* todo filter component and sort */}
          <FilterEventsByDate />
          <SortEvents />
          <AddNewEvent />
        </div>

        {events.length > 0 ? (
          events.map((event, index) => (
            <table className="my-8  w-full">
              <tbody>
                <tr className="border-b-2 border-black/25 bg-black/40">
                  <th className="p-2 text-start">Event</th>
                  <th className="p-2 text-start">Date</th>
                  <th className="p-2 text-start">Location</th>
                  <th className="p-2 text-start">Tickets Remaining</th>
                  <th className="p-2 text-start">Closing Date</th>
                  <th className="p-2 text-start">Organizer</th>
                  <th className="p-2 text-start"> </th>
                </tr>

                <tr className="border-b-2 border-black/25" key={index}>
                  <td className="p-2">
                    {event.title} <br /> {event.location}
                  </td>
                  <td className="p-2">
                    {event.startDate.toDateString()} <br />{" "}
                    {event.startDate.toTimeString().slice(0, 5)}
                  </td>
                  <td className="p-2">{event.location}</td>
                  <td className="p-2">
                    {event.tickets - event.ticketsSold} / {event.tickets}
                  </td>
                  <td className="p-2">{event.endDate.toDateString()}</td>
                  <td className="p-2">{event.organizerName}</td>
                  <td>menu</td>
                </tr>
              </tbody>
            </table>
          ))
        ) : (
          <div className="w-full flex justify-center p-8">
            <span>No Events in Database</span>
          </div>
        )}
      </div>
    </>
  );
};

export default EventBrowser;
