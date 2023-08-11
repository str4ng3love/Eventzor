import { Event } from "@prisma/client";

const sortEvents = (arr: Event[], sorter: number | string): Event[] => {
  let sortedArr: Event[];
  if (sorter.toString().toLowerCase() === "tickets left") {
    sortedArr = arr.sort((a, b) => a.tickets - b.tickets);
  } else if (sorter.toString().toLowerCase() === "date") {
    sortedArr = [...arr].sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );
  } else if (sorter.toString().toLowerCase() === "event") {
    sortedArr = arr.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase()
      return titleA.localeCompare(titleB)
    });
  } else if (sorter.toString().toLocaleLowerCase() === "organizer") {
    sortedArr = arr.sort((a, b) => {
      const titleA = a.organizerName.toLowerCase();
      const titleB = b.organizerName.toLowerCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA < titleB) {
        return 1;
      }
      return 0;
    });
  } else if (sorter.toString().toLocaleLowerCase() === "location") {
    sortedArr = arr.sort((a, b) => {
      const titleA = a.location.toLowerCase();
      const titleB = b.location.toLowerCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA < titleB) {
        return 1;
      }
      return 0;
    });
  } else {
    sortedArr = arr;
  }

  return sortedArr;
};

export { sortEvents };
