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
import EventSkeleton from "../../static/EventSkeleton";
import SpinnerMini from "../../static/SpinnerMini";

const MyEventBrowser = () => {
  const [filteredDates, setFilteredDates] = useState<{
    startDate: string;
    endDate: string;
  }>();
  const [eventsArr, setEventsArr] = useState<Event[] | null>(null);
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
        id
          ? setEventsArr((prev) =>
            prev
              ? prev.map((e) =>
                e.id === id
                  ? {
                    id,
                    closingDate: data.closingDate,
                    price: data.price,
                    images: data.images,
                    description: data.description,
                    eventDate: data.eventDate,
                    location: data.location,
                    organizerName: data.organizerName,
                    status: data.status,
                    tickets: data.tickets,
                    ticketsSold: data.ticketsSold,
                    title: data.title,
                    orders: data.orders,
                  }
                  : e
              )
              : null
          )
          : setEventsArr((prev) => (prev ? [...prev, data] : null));

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
  const getEvents = async () => {
    try {
      const resp = await fetch(`/api/events`, { cache: "no-store" });
      const events = await resp.json();

      if (events.error) {
        setNotify({ error: true, show: true, message: events.error });
      } else {
        return events;
      }
    } catch (error) {
      setNotify({
        error: true,
        show: true,
        message: `Cannot fetch data, try again later`,
      });
      console.log(error);
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
        return prev ? [...sortEvents(prev, target)] : null;
      });
    } else {
      setEventsArr((prev) => {
        return prev ? [...prev.reverse()] : null;
      });
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const cachedEntry = eventsArr?.filter((e) => e.id == id);
      setEventsArr((prev) =>
        prev ? [...prev.filter((e) => e.id != id)] : null
      );

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
        setEventsArr((prev) =>
          prev && cachedEntry ? [...prev, ...cachedEntry] : null
        );
        setNotify({ error: true, show: true, message: message.error });
      }
    } catch (error) {
      setNotify({ error: true, show: true, message: "Something went wrong" });
    }
  };
  useEffect(() => {
    const fetch = async () => {
      const events = await getEvents();

      setEventsArr(events);
    };
    fetch();
  }, []);
  if (eventsArr === null) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100dvh_-_30%)]">
        <SpinnerMini borderSize="border-[1rem]" h="h-32" w="w-32" />
      </div>
    );
  } else {
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
                  defaultDates={filteredDates}
                  passDates={(dates) => {
                    setFilteredDates(dates);
                  }}
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
                  passDates={(dates) => {
                    setFilteredDates(dates);
                  }}
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

            <AddNewEvent
              optimisticFn={() => {
                setOptimisticComp(true);
              }}
              refetchTrigger={() => getEvent()}
              optimisticFnClnUp={() => {
                setOptimisticComp(false);
              }}
            />
          </div>
          <table className="my-8  w-full text-sm table">
              <thead className="">
                <tr className="border-b-2 border-black/25 bg-black/40 table-row">
                  <th className="p-2 text-start">Date</th>
                  <th className="p-2 text-start">Event</th>
                  <th className="p-2 text-start">Tickets Remaining</th>
                  <th className="p-2 text-start">Closing Date</th>
                  <th className="p-2 text-start">Organizer</th>
                  <th className="p-2 text-start"></th>
                  <th className="p-2 text-start"></th>
                </tr>
              </thead>
            <tbody className="">
              {filtered
                ? filtered.map((event) => (
                  <EventComponent
                    isEmpty={event.images.length === 0}
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
                    isEmpty={event.images.length === 0}
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

              {eventsArr.length === 0 ? (
                <tr className="w-full flex justify-center p-8">
                  <td>No Events in Database</td>
                </tr>
              ) : (
                <></>
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
  }
};

export default MyEventBrowser;
