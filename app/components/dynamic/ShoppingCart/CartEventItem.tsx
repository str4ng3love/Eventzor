"use client";
import { useEffect, useState } from "react";
import ButtonWithIcon from "../ButtonWithIcon";
import Link from "next/link";
import { BiX } from "react-icons/bi";
interface Props {
  title: string;
  amount: number;
  price: number;
  currency: { name: String; rate: number };
  id: string;
  delFn: (e: React.MouseEvent, id: string) => void;
  closeFn: (e: React.MouseEvent) => void;
}

const CartEventItem = ({ ...props }: Props) => {
  const [amount, setAmount] = useState(props.amount);

  return (
    <div className="flex justify-between p-2 items-center w-full">
      <Link
        onClick={(e) => props.closeFn(e)}
        href={`/events/${props.title}`}
        className="p-2 m-r1 w-[25ch] overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {props.title}
      </Link>
      <input
        type="number"
        pattern="[0-9]"
        min={1}
        value={amount}
        onChange={(e) => {
          if (Number.isNaN(parseInt(e.currentTarget.value))) {
            return;
          } else {
            setAmount(parseInt(e.currentTarget.value));
          }
        }}
        className="w-20 bg-inherit focus:text-text focus:ring-0 focus:outline-none focus:bg-bg p-2 rounded-md transition-all duration-500"
      />

      <div className="p-2 m-r1 w-[16ch] hidden justify-between whitespace-nowrap lg:flex text-sm">
        <span>Per :&nbsp;</span>
        <span className="mr-1">
          {(props.price * props.currency.rate).toFixed(2)}
        </span>
      </div>
      <div className="p-2 m-r1 w-[18ch] flex justify-between whitespace-nowrap text-sm">
        <span>Total :&nbsp;</span>
        <span className="mr-1">
          {(props.price * amount * props.currency.rate).toFixed(2)}
        </span>
      </div>
      <span className="p-2 m-r1">
        <ButtonWithIcon
          Icon={BiX}
          size="1em"
          bgColor="bg-secondary"
          fn={(e) => props.delFn(e, props.title)}
        />
      </span>
    </div>
  );
};

export default CartEventItem;
