"use client";

import AddNewEvent from "./AddNewEvent";
import { Event } from "@prisma/client";
import FilterEventsByDate from "./FilterEventsByDate";
import SortEvents from "./SortEvents";
import { useState, useEffect } from "react";
import { sortEvents } from "@/helpers/sort";
import ResetFilter from "./ResetFilter";
interface Props {
  events: Event[];
}

const EventBrowser = ({ events }: Props) => {
  const [eventsArr, setEventsArr] = useState(events);
  const [sorter, setSorter] = useState("event");
  const [filtered, setFiltered] = useState<Event[] | null>();
  return (
    <>
      <div className="my-4 px-8 flex flex-col">
        <div className="flex justify-end gap-4">
          {/* todo filter component and sort */}
          {filtered ? (
            <div className="flex bg-link rounded-xl gap-2">
              <ResetFilter
                fn={(e) => {
                  setFiltered(null);
                }}
              />
              <FilterEventsByDate
                title="Filter by Date"
                fn={(e, dates) => {
                  setFiltered([
                    ...eventsArr.filter((event) => {
                      return (
                        event.startDate >= new Date(dates.startDate) &&
                        event.startDate <= new Date(dates.endDate)
                      );
                    }),
                  ]);
                }}
              />
              <SortEvents
                fn={(e) => {
                  let target = e.currentTarget.innerHTML.toLowerCase();
                  
                  if (!target) {
                    return null;
                  }
                  console.log(sorter === target);
                  if (sorter === target) {
                    setFiltered((prev) => {
                      if (prev) {
                        return [...prev.reverse()];
                      }
                    });
                  } else {
                    console.log(target)
                    setSorter(target);

                    setFiltered((prev) => {
                      if (prev) {
                        return [...sortEvents(prev, target)];
                      }
                    });
                  }
                  console.log(filtered);
                }}
              />
            </div>
          ) : (
            <>
              <FilterEventsByDate
                title="Filter by Date"
                fn={(e, dates) => {
                  setFiltered([
                    ...eventsArr.filter((event) => {
                      return (
                        event.startDate >= new Date(dates.startDate) &&
                        event.startDate <= new Date(dates.endDate)
                      );
                    }),
                  ]);
                }}
              />
              <SortEvents
                fn={(e) => {
                  let target = e.currentTarget.innerHTML.toLowerCase();
                  if (!target) {
                    return null;
                  }
                  if (sorter !== target) {
                    setSorter(target);
                    setEventsArr((prev) => {
                      return [...sortEvents(prev, target)];
                    });
                  } else {
                    setEventsArr((prev) => {
                      return [...prev.reverse()];
                    });
                  }
                }}
              />
            </>
          )}

          <AddNewEvent />
        </div>
        <table className="my-8  w-full">
          <tbody>
            <tr className="border-b-2 border-black/25 bg-black/40">
              <th className="p-2 text-start">Event</th>
              <th className="p-2 text-start">Date</th>
              <th className="p-2 text-start">Location</th>
              <th className="p-2 text-start">Tickets Remaining</th>
              <th className="p-2 text-start">Closing Date</th>
              <th className="p-2 text-start">Organizer</th>
              <th className="p-2 text-start"></th>
            </tr>
            {eventsArr.length > 0 ? (
              <>
                {filtered
                  ? filtered.map((el, index) => (
                      <tr className="border-b-2 border-black/25" key={index}>
                        <td className="p-2">
                          {el.title} <br /> {el.location}
                        </td>
                        <td className="p-2">
                          {el.startDate.toDateString()} <br />
                          {el.startDate.toTimeString().slice(0, 5)}
                        </td>
                        <td className="p-2">{el.location}</td>
                        <td className="p-2">
                          {el.tickets - el.ticketsSold} / {el.tickets}
                        </td>
                        <td className="p-2">
                          {el.endDate.toDateString()}
                          <br />
                          {el.endDate.toTimeString().slice(0, 5)}
                        </td>
                        <td className="p-2">{el.organizerName}</td>
                        <td>menu</td>
                      </tr>
                    ))
                  : eventsArr.map((event, index) => (
                      <tr className="border-b-2 border-black/25" key={index}>
                        <td className="p-2">
                          {event.title} <br /> {event.location}
                        </td>
                        <td className="p-2">
                          {event.startDate.toDateString()} <br />
                          {event.startDate.toTimeString().slice(0, 5)}
                        </td>
                        <td className="p-2">{event.location}</td>
                        <td className="p-2">
                          {event.tickets - event.ticketsSold} / {event.tickets}
                        </td>
                        <td className="p-2">
                          {event.endDate.toDateString()}
                          <br />
                          {event.endDate.toTimeString().slice(0, 5)}
                        </td>
                        <td className="p-2">{event.organizerName}</td>
                        <td>menu</td>
                      </tr>
                    ))}
              </>
            ) : (
              <tr className="w-full flex justify-center p-8">
                <td>No Events in Database</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EventBrowser;
