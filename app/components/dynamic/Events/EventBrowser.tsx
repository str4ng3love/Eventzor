"use client";
import AddNewEvent from "./AddNewEvent";
import { Event } from "@prisma/client";
import FilterEventsByDate from "./FilterEventsByDate";
import DropDown from "../DropDown";
import React, { useEffect, useState } from "react";
import { sortEvents } from "@/helpers/sort";
import ResetFilter from "./ResetFilter";
import Notification from "../../static/Notification";
import { NotificationObj } from "../../static/Notification";
import EventComponent from "./EventComponent";
import EditEvent from "./EditEvent";
import EventSkeleton from "./EventSkeleton";

interface Props {
  events: Event[];
}
const EventBrowser = ({ events }: Props) => {
  const [eventsArr, setEventsArr] = useState(events);
  const [sorter, setSorter] = useState("event");
  const [filtered, setFiltered] = useState<Event[] | null>();
  const [notify, setNotify] = useState<NotificationObj>();
  const [edit, setEdit] = useState<{ show: boolean; event: Event | null }>({
    show: false,
    event: null,
  });
  const [optimisticComp, setOptimisticComp] = useState(false);

  const getEvent = async (id?: string) => {
    try {
      let resp;
      id
        ? (resp = await fetch(`/api/events/${id}`))
        : (resp = await fetch("/api/events/latest"));

      const data = await resp.json();

      if (data) {

        id? setEventsArr((prev) => prev.map((e) =>  e.id === id
                  ? {
                      id,
                      closingDate: data.closingDate,
                      description: data.description,
                      eventDate: data.eventDate,
                      location: data.location,
                      organizerName: data.organizerName,
                      status: data.status,
                      tickets: data.tickets,
                      ticketsSold: data.ticketsSold,
                      title: data.title,
                    }
                  : e
              )
            )
          : setEventsArr((prev) => [...prev, data]);


        setOptimisticComp(false);
      } else {
        setNotify({
          show: true,
          error: true,
          message: "Could not fetch the events. Please try again.",
        });
      }
    } catch (error) {
      if (error) {
        setNotify({
          show: true,
          error: true,
          message: "Could not fetch the events. Please try again.",
        });
      }
    }
  };

  const SortEvents = (e: React.MouseEvent) => {
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
  };

  const deleteEvent = async (id: string) => {
    try {
      const cachedEntry = eventsArr.filter((e) => e.id == id);
      setEventsArr((prev) => [...prev.filter((e) => e.id != id)]);

      const resp = await fetch("/api/events", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const message = await resp.json();
      if (resp.ok) {
        setNotify({ error: false, show: true, message: message.message });
      } else if (message.error) {
        setEventsArr((prev) => [...prev, ...cachedEntry]);
        setNotify({ error: true, show: true, message: message.error });
      }
    } catch (error) {
      setNotify({ error: true, show: true, message: "Something went wrong" });
    }
  };
  return (
    <>
      <div className="my-4 px-8 flex flex-col">
        <div className="flex justify-end gap-4 text-sm items-center">
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
                        event.eventDate >= new Date(dates.startDate) &&
                        event.eventDate <= new Date(dates.endDate)
                      );
                    }),
                  ]);
                }}
              />
              <DropDown
                title="Sort by"
                fn={(e) => {
                  SortEvents(e);
                }}
                items={["date", "location", "organizer", "event", "tickets"]}
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
                        event.eventDate >= new Date(dates.startDate) &&
                        event.eventDate <= new Date(dates.endDate)
                      );
                    }),
                  ]);
                }}
              />
              <DropDown
                title="Sort by"
                fn={(e) => {
                  SortEvents(e);
                }}
                items={["date", "location", "organizer", "event", "tickets"]}
              />
            </>
          )}
          <span onClick={(e) => console.log(eventsArr)}>check</span>

          <AddNewEvent
            fn={(e) => {
              setOptimisticComp(true);
            }}
            refetchTrigger={() => getEvent()}
          />
        </div>
        <table className="my-8  w-full text-sm table">
          <tbody className="">
            <tr className="border-b-2 border-black/25 bg-black/40 table-row">
              <th className="p-2 text-start">Date</th>
              <th className="p-2 text-start">Event</th>
              <th className="p-2 text-start">Tickets Remaining</th>
              <th className="p-2 text-start">Closing Date</th>
              <th className="p-2 text-start">Organizer</th>
              <th className="p-2 text-start"></th>
            </tr>
            {eventsArr.length > 0 ? (
              <>
                {filtered
                  ? filtered.map((event) => (
                      <EventComponent
                        key={event.id}
                        {...event}
                        delFn={() => {
                          deleteEvent(event.id);
                        }}
                        editFn={() => {
                          setEdit({ show: true, event: event });
                        }}
                      />
                    ))
                  : eventsArr.map((event) => (
                      <EventComponent
                        key={event.id}
                        {...event}
                        delFn={() => {
                          deleteEvent(event.id);
                        }}
                        editFn={() => {
                          setEdit({ show: true, event: event });
                        }}
                      />
                    ))}
                {optimisticComp ? <EventSkeleton /> : <></>}
              </>
            ) : (
              <tr className="w-full flex justify-center p-8">
                <td>No Events in Database</td>
              </tr>
            )}
          </tbody>
        </table>
        {notify ? (
          <Notification
            error={notify.error}
            message={notify.message}
            show={notify.show}
            onAnimEnd={() => {
              setNotify({ error: false, message: "", show: false });
            }}
          />
        ) : (
          <></>
        )}
        {edit.show && edit.event ? (
          <EditEvent
            {...edit.event}
            show={edit.show}
            stopDisplayingFn={() => {
              setEdit({ show: false, event: null });
            }}
            triggerFetchFn={() => getEvent(edit.event?.id)}
          />
          
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default EventBrowser;
