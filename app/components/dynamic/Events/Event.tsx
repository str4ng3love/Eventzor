"use client";
import { Event } from "@prisma/client";
import { FaArrowAltCircleRight } from "react-icons/fa";

const Event = ({
  title,
  date,
  description,
  id,
  location,
  organizerName,
  status,
  tickets,
  ticketsSold,
}: Event) => {

  const dateParsed = date.toLocaleDateString("en-EN", {day: "numeric", month: 'long', year: 'numeric'});
  return (
    <div className="flex items-center w-full justify-between text-sm">
      <span className="py-2 px-4 w-44">
        {dateParsed}
      </span>
      <span className="py-2 px-4">{title}</span>
      <span className="py-2 px-4">
        {tickets - ticketsSold} / {tickets}
      </span>
      <span className="py-2 px-4">closing date</span>
      <span className="py-2 px-4">{status}</span>
      <span className="py-2 px-4 flex items-center justify-center ">
        <FaArrowAltCircleRight />
      </span>
    </div>
  );
};

export default Event;
