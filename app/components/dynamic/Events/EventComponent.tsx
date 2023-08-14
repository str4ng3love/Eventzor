"use client";
import { Event } from "@prisma/client";
import { CiMenuKebab } from "react-icons/ci";
import DropDownMini from "../DropDownMini";
interface EventProps extends Event {
  delFn: (e: React.MouseEvent) => void;
  editFn: (e: React.MouseEvent) => void;
}
const EventComponent = ({ ...props }: EventProps) => {
  return (
    <tr className="border-b-2 border-black/25 animate-fadeIn -z-50 ">
      <td className="p-2">
        <b>{props.eventDate.toDateString()}</b>
      </td>
      <td className="p-2">
        <b>{props.title}</b> <br /> {props.location}&nbsp;-&nbsp;
        {props.eventDate.getUTCHours()}:
        {props.eventDate.getUTCMinutes().toString().padStart(2, "0")}
      </td>
      <td className="p-2">
        {props.tickets - props.ticketsSold} / {props.tickets}
      </td>
      <td className="p-2">
        <b>{props.closingDate.toDateString()}</b> <br />
        {props.closingDate.toTimeString().slice(0, 5)}
      </td>
      <td className="p-2">{props.organizerName}</td>
      <td className="overflow-visible h-[100%] m-0 p-0 flex items-center justify-center">
        <DropDownMini
          items={[
            {
              text: "Edit",
              fn(e) {
                props.editFn(e);
              },
            },
            {
              text: "Delete",
              fn(e) {
                props.delFn(e);
              },
            },
          ]}
          Icon={CiMenuKebab}
          bgColor="bg-bg"
          size="1em"
        />
      </td>
    </tr>
  );
};

export default EventComponent;
