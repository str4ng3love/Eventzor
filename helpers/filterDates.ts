import { Event } from "@prisma/client";

const filterDates = (
  event: Event,
  dates: { startDate: string; endDate: string },
) => {
  return (
    event.eventDate.toDateString() >= dates.startDate &&
    dates.startDate <= event.eventDate.toDateString()
  );
};

export { filterDates };
