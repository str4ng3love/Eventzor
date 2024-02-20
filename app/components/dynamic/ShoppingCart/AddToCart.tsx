"use client";

import { useState, useRef } from "react";
import Button from "../Button";

interface Props {
  item: string;
  id:string;
  type:string;
  price:number;
  amountLeft: number;
  saleEnded?: boolean
}

const AddToCart = ({ item,type, price, id, amountLeft, saleEnded=false }: Props) => {

  const [amount, setAmount] = useState(1);
  const inputEl = useRef<HTMLInputElement>(null);
 
  return (
    <div className="w-full flex flex-col justify-start items-center p-8 dark:text-text text-interactive_text">
      <div
        className="flex md:flex-row flex-col items-center mb-8"
        onClick={() => {
          inputEl.current?.focus();
        }}
      >
        <label htmlFor="amountOfProducts" className="p-1 mr-2">Amount&nbsp;:</label>
        <input
        id="amountOfProducts"
          aria-label="Amount"
          ref={inputEl}
          value={amount}
          className="xl:w-40 w-24  bg-inherit focus:text-text focus:ring-0 focus:outline-none focus:bg-bg p-2 rounded-md transition-all duration-500"
          type="number"
          min={1}
          onChange={(e) => setAmount(parseInt(e.currentTarget.value))}
        />
      </div>
      {/* TODO: proper localstorage fn */}
      <Button
      size="text-sm sm:text-base"
      interactive={amountLeft === 0 || saleEnded ? false : true}
      title="Add to cart"
        text="Add to cart"
        fn={() => {
          if(amountLeft === 0 || saleEnded){
            return
          }
          let prev = localStorage.getItem("cart")
          

          if (prev !== null && prev.length > 0) {
            let prevString = JSON.parse(prev);
            if(prevString[prevString.length-1].id === id){
              prevString[prevString.length-1].item = item
              prevString[prevString.length-1].amount = amount
              prevString[prevString.length-1].price = price
              localStorage.setItem("cart", JSON.stringify(prevString));
              window.dispatchEvent(new Event('storage'))
            } else {
              prevString.push({ id: id, amount: amount, type:type, price:price, item:item });
              localStorage.setItem("cart", JSON.stringify(prevString));
              window.dispatchEvent(new Event('storage'))
            }
          } else {
            localStorage.setItem(
              "cart",
              JSON.stringify([{ id: id, amount: amount, type:type, price:price, item:item }])
            );
            window.dispatchEvent(new Event('storage'))
          }
        }}
      />
    </div>
  );
};

export default AddToCart;
