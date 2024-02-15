
import { Event } from "@prisma/client";
import DropDownMini from "../DropDownMini";
import { BiDotsVertical } from "react-icons/bi";
import InfoPopover from "../Popover";
import Link from "next/link";


interface EventProps extends Event {
  delFn: (e: React.MouseEvent) => void;
  editFn: (e: React.MouseEvent) => void;
  isEmpty?: boolean
}
const EventComponent = ({ ...props }: EventProps) => {

  return (
    <>
      <tr className="border-b-2 border-black/25 animate-fadeIn -z-50 ">

        <td className="p-2">
          <b>{new Date(props.eventDate).toDateString()}</b>
        </td>
        <td className="p-2">
          <Link className="hover:bg-link hover:text-text p-1 w-full flex flex-col rounded-md transition-all duration-200" href={`/event/${props.title}`}>
            <b>{props.title}</b> <br /> {props.location}&nbsp;-&nbsp;
            {new Date(props.eventDate).getUTCHours()}:
            {new Date(props.eventDate)
              .getUTCMinutes()
              .toString()
              .padStart(2, "0")}
          </Link>
        </td>
        <td className="p-2">
          {props.tickets} / {props.ticketsSold}
        </td>
        <td className="p-2">
          <b>{new Date(props.closingDate).toDateString()}</b> <br />
          {new Date(props.closingDate).toTimeString().slice(0, 5)}
        </td>
        <td className="h-[100%] ml-8 p-0 flex items-center justify-center">
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
            Icon={BiDotsVertical}
            bgColor="bg-bg"
            size="1em"
          />

        </td>

      </tr>
    </>
  );
};

export default EventComponent;
