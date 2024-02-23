import { Event } from "@prisma/client";
import DropDownMini from "../DropDownMini";
import { BiDotsVertical } from "react-icons/bi";
import InfoPopover from "../Popover";
import Link from "next/link";

interface EventProps extends Event {
  delFn: (e: React.MouseEvent) => void;
  editFn: (e: React.MouseEvent) => void;
  isEmpty?: boolean;
}
const MyEventComponent = ({ ...props }: EventProps) => {
  return (
    <>
      <tr className="-z-50 animate-fadeIn border-b-2 border-black/25 ">
        <td className="p-2">
          <b>{new Date(props.eventDate).toDateString()}</b>
        </td>
        <td className="p-2">
          <Link
            className="flex w-full flex-col rounded-md p-1 transition-all duration-200 hover:bg-link hover:text-text"
            href={`/event/${props.title}`}
          >
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
        <td className="ml-8 flex h-[100%] items-center justify-center p-0">
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

export default MyEventComponent;
