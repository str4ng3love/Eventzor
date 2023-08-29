"use client";
import { useState } from "react";
import ButtonWithIcon from "./ButtonWithIcon";
import { BiX } from "react-icons/bi";
interface Props {
  title: string;
  amount: number;
  delFn: (e:React.MouseEvent, id:string) => void;
}

const CartItem = ({ ...props }: Props) => {
  const [amount, setAmount] = useState(props.amount);
  return (
    <div className="flex justify-start p-2 items-center">
      <span className="p-2 m-r1">{props.title}</span>
      <input
        type="number"
        pattern="[0-9]"
        min={1}
        value={amount}
        onChange={(e) => {
          if (Number.isNaN(parseInt(e.currentTarget.value))) {
            return
          } else {
            setAmount(parseInt(e.currentTarget.value));
          }
        }}
        className="w-20 bg-inherit focus:text-text focus:ring-0 focus:outline-none focus:bg-bg p-2 rounded-md transition-all duration-500"
      />
      <span className="p-2 m-r1">price</span>
      <span className="p-2 m-r1"><ButtonWithIcon Icon={BiX} size="1em" bgColor="bg-secondary" fn={(e)=>props.delFn(e, props.title)}/></span>
    </div>
  );
};

export default CartItem;
