"use client";
import { useEffect, useState } from "react";
import ButtonWithIcon from "../ButtonWithIcon";
import Link from "next/link";
import { BiX } from "react-icons/bi";
import { CartItemData } from "./ShoppingCart";
interface Props extends CartItemData {
  currency: { name: String; rate: number };
  delFn: (e: React.MouseEvent, id: string) => void;
  closeFn: (e: React.MouseEvent) => void;
}

const CartItem = ({ ...props }: Props) => {
  const [amount, setAmount] = useState(props.amount);
  // console.log(props)
  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      const cartArr: CartItemData[] = Array.from(JSON.parse(cart));
      const updatedArr = cartArr.map((i) => {
        if (i.id == props.id) {
          return { ...i, amount: amount };
        } else {
          return i;
        }
      });
      localStorage.setItem("cart", JSON.stringify(updatedArr));
      window.dispatchEvent(new Event("storage"));
    }
  }, [amount]);
  return (
    <div className="flex w-full items-center justify-between p-2">
      <Link
        onClick={(e) => props.closeFn(e)}
        href={`${"/" + props.type + "/" + props.item}`}
        className="m-r1 w-[25ch] overflow-hidden text-ellipsis whitespace-nowrap p-2"
      >
        {props.item}
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
        className="w-20 rounded-md bg-inherit p-2 transition-all duration-500 focus:bg-bg focus:text-text focus:outline-none focus:ring-0"
      />

      <div className="m-r1 hidden w-[16ch] justify-between whitespace-nowrap p-2 text-sm lg:flex">
        <span>Per :&nbsp;</span>
        <span className="mr-1">
          {(props.price * props.currency.rate).toFixed(2)}
        </span>
      </div>
      <div className="m-r1 flex w-[18ch] justify-between whitespace-nowrap p-2 text-sm">
        <span>Total :&nbsp;</span>
        <span className="mr-1">
          {(props.price * amount * props.currency.rate).toFixed(2)}
        </span>
      </div>
      <span className="m-r1 p-2">
        <ButtonWithIcon
          Icon={BiX}
          size="1em"
          bgColor="bg-secondary"
          fn={(e) => props.delFn(e, props.item)}
        />
      </span>
    </div>
  );
};

export default CartItem;
