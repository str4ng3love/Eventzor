// todo : Complete

import { MarketItem } from "@prisma/client";
import DropDownMini from "../DropDownMini";
import { BiDotsVertical } from "react-icons/bi";

interface ItemProps extends MarketItem {
  delFn: (e: React.MouseEvent) => void;
  editFn: (e: React.MouseEvent) => void;
}
const ItemComponent = ({ ...props }: ItemProps) => {
 
  return (
    <tr className="border-b-2 border-black/25 animate-fadeIn ">
      <td className="p-2">{props.item}</td>
      <td className="p-2">{props.price.toFixed(2)}</td>
      <td className="p-2">{props.amountSold}&nbsp;/&nbsp;{props.amount}</td>
     
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
  );
};

export default ItemComponent;
