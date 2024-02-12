"use client";

import { useEffect, useState } from "react";

import Notification from "../../static/Notification";
import { ParsedOrder } from "@/types/interfaces";
import Button from "../Button";
import ConfirmDialog from "../ConfirmDialog";

interface Props {
  ordersArray: ParsedOrder[]
  email: string
}

export const MyOrderBrowser = ({ ordersArray, email }: Props) => {

  const [show, setShow] = useState(false);
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

  const calcTotal = (arr: { price: number; amount: number }[]) => {
    const total = arr.reduce((acc, val) => {
      acc = acc + val.price * selectedCurrency.rate * val.amount;
      return parseFloat(acc.toFixed(2));
    }, 0)

    return total
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

  return (<>
    <div className="p-4 flex flex-col gap-2">
      {ordersArr.map(o =>
        <div key={o.id} className="p-4 bg-bg_interactive rounded-md text-sm">
          <div className="flex justify-between items-center">
            <span className="p-1">
              Order ID&nbsp;:&nbsp;{o.id}
            </span>


            {show ? <ConfirmDialog show={show} text={`delete`} fn={() => { setShow(false); cancelOrder(o.id) }} /> : <></>}
          </div>
          <div className="flex flex-col">
            <span className="p-1">Ordered&nbsp;:&nbsp;{new Date(o.orderedAt).toISOString().slice(0, -8).replace("T", " ")}</span>
            <div className="flex justify-between items-center">
              <span className="p-1">Status&nbsp;:&nbsp;{o.status}</span>
            </div>

          </div>
          <div className="p-2 pt-5">
            <div className="p-1 grid grid-cols-6 gap-1 w-full  ring-1 ring-primary first-letter:uppercase">
              <span className="col-span-3 first-letter:uppercase">item</span>
              <span className="first-letter:uppercase">amount</span>
              <span className="first-letter:uppercase">price</span>
              <span className="first-letter:uppercase">total</span>
            </div>
            {o.amounts.map((a, i) =>
              <div key={i} className="p-1 grid grid-cols-6 gap-1 w-full  ring-1 ring-primary font-normal">
                <span className="col-span-3 overflow-clip">{a.item}</span>
                <span className="overflow-clip">{a.amount}</span>
                <span className="uppercase">{a.price * selectedCurrency.rate}&nbsp;{selectedCurrency.name}</span>
                <span className="uppercase">{a.amount * a.price}&nbsp;{selectedCurrency.name}</span>
              </div>
            )}
            <span className="text-lg flex items-center justify-end p-2">Overall&nbsp;{calcTotal(o.amounts)}<span className="uppercase flex items-center">&nbsp;{selectedCurrency.name}</span></span>
            <div className={`flex ${o.status !== "canceled" ? "justify-between" : "justify-end items-center"} mt-4`}>
              {o.status !== "shipping" && o.status !== "canceled" ? <Button text="Cancel Order" title="Cancel Order" fn={() => { setShow(true) }} bgColor="bg-secondary text-sm" /> : <></>}
              {o.status === "pendingPayment" ? <Button text="proceed to payment" title="pay" link={`/lipps/${o.id}?c=${selectedCurrency.name}`} /> : <></>}
            </div>

          </div>
        </div>)}


    </div>
    <Notification {...notify} onAnimEnd={() => { setNotify({ error: false, message: '', show: false }) }} />
  </>
  );
};
