"use client";

import { useEffect, useState } from "react";

import Notification from "../../static/Notification";
import { ParsedOrder } from "@/types/interfaces";
interface Props {
  ordersArray: ParsedOrder[]
  email: string
}

export const MyOrderBrowser = ({ ordersArray, email }: Props) => {

  const [show, setShow] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(email)
  const [notify, setNotify] = useState({ message: '', show: false, error: false })
  const [working, setWorking] = useState(false)
  const [ordersArr, setOrdersArr] = useState(ordersArray);
  const [selectedCurrency, setSelectedCurrency] = useState({ name: "usd", rate: 1 });
  const [total, setTotal] = useState<number[]>();

  const cancelOrder = async (id: string) => {
    const rollback = ordersArr ? [...ordersArr] : []
    setOrdersArr((prev) => prev?.filter(o => o.id !== id))
    try {
      const resp = await fetch("/api/orders/my_orders", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      const message = await resp.json()
      if (message.error) {
        setNotify({ error: true, message: 'Something went wrong, try again later', show: true })
        setOrdersArr(rollback)
      } else {
        setNotify({ error: false, message: message.message, show: true })
      }
    } catch (error) {
      setOrdersArr(rollback)
      console.log(error);
    }
  };

  const calcTotal = (arr: { amounts: { price: number; amount: number }[] }[]) => {
    const total = arr.map((a) =>
      a.amounts.reduce((acc, val) => {
        acc = acc + val.price * selectedCurrency.rate * val.amount;
        return parseFloat(acc.toFixed(2));
      }, 0)
    );
    setTotal(total);
  };

  useEffect(() => {
    window.addEventListener("currency", () => {
      const currency = localStorage.getItem("currency");
      if (currency) {
        let selectedCurrency = JSON.parse(currency);
        setSelectedCurrency({
          name: selectedCurrency.name,
          rate: selectedCurrency.rate,
        });
      }
    });

    return () => {
      window.removeEventListener("currency", () => { });
    };
  });
  console.log(ordersArr)
  return (<>
    <div className="p-4 text-sm flex flex-col gap-2">
      {ordersArr.map(o =>
        <div key={o.id} className="p-2 bg-bg_interactive rounded-md">
          <div className="text-base">
            <span>
              Order ID&nbsp;: {o.id}
            </span>
          </div>
          <span>
            Ordered&nbsp;:&nbsp;{new Date(o.orderedAt).toISOString().slice(0, -8).replace("T", " ")}
          </span>
          <div className="p-2">
            {o.amounts.map((a, i) =>
              <div key={i} className="p-2 flex gap-1 w-full justify-between ring-1 ring-primary">
                <span>{a.item}</span>
                <span>{a.amount}</span>
                <span>{a.price*selectedCurrency.rate}{selectedCurrency.name}</span>
                <span>{a.amount * a.price}</span>
              </div>
            )}
          </div>
        </div>)}
    </div>
    <Notification {...notify} onAnimEnd={() => { setNotify({ error: false, message: '', show: false }) }} />
  </>
  );
};
