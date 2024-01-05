import { Event, MarketItem } from "@prisma/client";

const sortEvents = (arr: Event[], sorter: string): Event[] => {
  let sortedArr: Event[];
  if (sorter.toString().toLowerCase().includes("tickets")) {
    sortedArr = arr.sort((a, b) => a.tickets - b.tickets);
  } else if (sorter.toString().toLowerCase() === "date") { 
    sortedArr = [...arr].sort(
      (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
  } else if (sorter.toString().toLowerCase() === "event") {
    sortedArr = arr.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return titleA.localeCompare(titleB);
    });
  } else if (sorter.toString().toLowerCase() === "organizer") {
    sortedArr = arr.sort((a, b) => {
      const organizerA = a.organizerName.toLowerCase();
      const organizerB = b.organizerName.toLowerCase();
      return organizerA.localeCompare(organizerB);
    });
  } else if (sorter.toString().toLowerCase() === "location") {
    sortedArr = arr.sort((a, b) => {
      const locationA = a.location.toLowerCase();
      const locationB = b.location.toLowerCase();
      return locationA.localeCompare(locationB);
    });
  } else {
    sortedArr = arr;
  }

  return sortedArr;
};

// const sortOrders = (arr: Order[], sorter: number | string): Order[] => {
//   let sortedArr: Order[];
//   if (sorter.toString().toLowerCase().includes("amount")) {
//     sortedArr = arr.sort((a, b) => a.amount - b.amount);
//   }  else if (sorter.toString().toLowerCase() === "item") {
//     sortedArr = arr.sort((a, b) => {
//       const titleA = a.item.toLowerCase();
//       const titleB = b.item.toLowerCase();
//       return titleA.localeCompare(titleB);
//     });
//   } else if (sorter.toString().toLowerCase().includes("price")) {
//     sortedArr = arr.sort((a, b) => a.price - b.price);
//   }else {
//     sortedArr = arr;
//   }

//   return sortedArr;
// };
const sortItems = (arr: MarketItem[], sorter: number | string): MarketItem[] => {
  let sortedArr: MarketItem[];
  if (sorter.toString().toLowerCase().includes("amount")) {
    sortedArr = arr.sort((a, b) => a.amount - b.amount);
  }  else if (sorter.toString().toLowerCase() === "item") {
    sortedArr = arr.sort((a, b) => {
      const titleA = a.item.toLowerCase();
      const titleB = b.item.toLowerCase();
      return titleA.localeCompare(titleB);
    });
  } else if (sorter.toString().toLowerCase().includes("price")) {
    sortedArr = arr.sort((a, b) => a.price - b.price);
  }else {
    sortedArr = arr;
  }

  return sortedArr;
};
export { sortEvents, sortItems };
