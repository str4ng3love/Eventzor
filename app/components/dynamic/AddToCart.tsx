"use client";

import { useState, useRef } from "react";
import Button from "./Button";

interface Props {
  item: string;
}

const AddToCart = ({ item }: Props) => {
  const [amount, setAmount] = useState(1);
  const inputEl = useRef<HTMLInputElement>(null);
  return (
    <div className="w-full flex flex-col justify-start items-center p-8 dark:text-text text-interactive_text">
      <div
        className="flex items-center mb-8"
        onClick={() => {
          inputEl.current?.focus();
        }}
      >
        <label className="p-1 mr-2">Amount&nbsp;:</label>
        <input
          ref={inputEl}
          value={amount}
          className="xl:w-40 lg:w-24 bg-inherit focus:text-text focus:ring-0 focus:outline-none focus:bg-bg p-2 rounded-md transition-all duration-500"
          type="number"
          min={1}
          onChange={(e) => setAmount(parseInt(e.currentTarget.value))}
        />
      </div>
      {/* TODO: proper localstorage fn */}
      <Button
        text="Add to cart"
        fn={() => {
          let prev = localStorage.getItem("cart");

          if (prev !== null) {
            let prevString = JSON.parse(prev);
            if(prevString[prevString.length-1].id === item){
              prevString[prevString.length-1].amount = amount
              localStorage.setItem("cart", JSON.stringify(prevString));
              window.dispatchEvent(new Event('storage'))
            } else {
              prevString.push({ id: item, amount: amount });
              localStorage.setItem("cart", JSON.stringify(prevString));
              window.dispatchEvent(new Event('storage'))
            }
          } else {
            localStorage.setItem(
              "cart",
              JSON.stringify([{ id: item, amount: amount }])
            );
            window.dispatchEvent(new Event('storage'))
          }
        }}
      />
    </div>
  );
};

export default AddToCart;
