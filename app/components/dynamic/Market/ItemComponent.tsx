"use client"

// todo : Complete

import { MarketItem } from "@prisma/client";
import DropDownMini from "../DropDownMini";
import { BiDotsVertical } from "react-icons/bi";
import InfoPopover from "../Popover";

interface ItemProps extends MarketItem {
  delFn: (e: React.MouseEvent) => void;
  editFn: (e: React.MouseEvent) => void;
  isEmpty?: boolean;
}
const ItemComponent = ({ ...props }: ItemProps) => {

  return (<>
    <tr className="border-b-2 border-black/25 animate-fadeIn ">
      <td className="p-2">{props.item}</td>
      <td className="p-2">{props.price.toFixed(2)}</td>
      <td className="p-2">
        {props.amountSold}&nbsp;/&nbsp;{props.amount}
      </td>
      <td className="w-[12ch] p-2">{props.isEmpty? <InfoPopover fn={(e)=>props.editFn(e)} text="!" message="There are no images attached to your item, this wont allow the item to be found on the website."/> :<></>}</td>
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

export default ItemComponent;
