"use client";

import { MarketItem } from "@prisma/client";
import DropDownMini from "../DropDownMini";
import { BiDotsVertical } from "react-icons/bi";
import InfoPopover from "../Popover";
import Link from "next/link";

interface ItemProps extends MarketItem {
  delFn: (e: React.MouseEvent) => void;
  editFn: (e: React.MouseEvent) => void;
  isEmpty?: boolean;
}
const MyItemComponent = ({ ...props }: ItemProps) => {
  return (
    <>
      <tr className="animate-fadeIn border-b-2 border-black/25 ">
        <td className="p-2">
          <Link
            className="flex w-full flex-col rounded-md p-1 transition-all duration-200 hover:bg-link hover:text-text"
            href={`/item/${props.item}`}
          >
            {props.item}
          </Link>
        </td>
        <td className="p-2">{props.price.toFixed(2)}</td>
        <td className="p-2">
          {props.amountSold}&nbsp;/&nbsp;{props.amount}
        </td>
        <td className="w-[12ch] p-2">
          {props.isEmpty ? (
            <InfoPopover
              fn={(e) => props.editFn(e)}
              text="!"
              message="There are no images attached to your item, this wont allow the item to be found on the website."
            />
          ) : (
            <></>
          )}
        </td>
        <td>
          <DropDownMini
            Icon={BiDotsVertical}
            bgColor="bg-bg"
            size="1em"
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
          />
        </td>
      </tr>
    </>
  );
};

export default MyItemComponent;
