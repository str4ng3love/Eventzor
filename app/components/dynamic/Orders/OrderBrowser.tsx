"use client";

import { useEffect, useState } from "react";

import Notification from "../../static/Notification";
import { ParsedOrder } from "@/types/interfaces";
import Button from "../Button";
import ConfirmDialog from "../ConfirmDialog";
import { FaMoneyBillWave, FaShippingFast } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";

interface Props {
  ordersArray: ParsedOrder[];
}

export const OrderBrowser = ({ ordersArray }: Props) => {
  const [show, setShow] = useState(false);
  const [notify, setNotify] = useState({
    message: "",
    show: false,
    error: false,
  });
  const [ordersArr, setOrdersArr] = useState(ordersArray);
  const [selectedCurrency, setSelectedCurrency] = useState({
    name: "usd",
    rate: 1,
  });

  const cancelOrder = async (id: string) => {
    const rollback = ordersArr ? [...ordersArr] : [];
    setOrdersArr((prev) => prev?.filter((o) => o.id !== id));
    try {
      const resp = await fetch("/api/orders/my_orders", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      const message = await resp.json();
      if (message.error) {
        setNotify({
          error: true,
          message: "Something went wrong, try again later",
          show: true,
        });
        setOrdersArr(rollback);
      } else {
        setNotify({ error: false, message: message.message, show: true });
      }
    } catch (error) {
      setOrdersArr(rollback);
      console.log(error);
    }
  };

  const calcTotal = (arr: { price: number; amount: number }[]) => {
    const total = arr.reduce((acc, val) => {
      acc = acc + val.price * selectedCurrency.rate * val.amount;
      return parseFloat(acc.toFixed(2));
    }, 0);

    return total;
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
      window.removeEventListener("currency", () => {});
    };
  });

  return (
    <>
      <div className="flex flex-col gap-2 bg-black/20 p-4">
        {ordersArr.map((o) => (
          <div key={o.id} className="bg-bg_interactive rounded-md p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="p-1">Order ID&nbsp;:&nbsp;{o.id}</span>

              {show ? (
                <ConfirmDialog
                  show={show}
                  text={`delete`}
                  fn={() => {
                    setShow(false);
                    cancelOrder(o.id);
                  }}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col">
              <span className="p-1">
                Ordered&nbsp;:&nbsp;
                {new Date(o.orderedAt)
                  .toISOString()
                  .slice(0, -8)
                  .replace("T", " ")}
              </span>
              <div className="flex items-center justify-between">
                {o.status === "pendingPayment" ? (
                  <span className="flex items-center gap-2 p-1">
                    Status&nbsp;:&nbsp;Awaiting Payment <FaMoneyBillWave />
                  </span>
                ) : null}
                {o.status === "canceled" ? (
                  <span className="flex items-center gap-2 p-1">
                    Status&nbsp;:&nbsp;Canceled <FcCancel />
                  </span>
                ) : null}
                {o.status === "shipping" ? (
                  <span className="flex items-center gap-2 p-1">
                    Status&nbsp;:&nbsp;In Shipping <FaShippingFast />
                  </span>
                ) : null}
              </div>
            </div>
            <div className="p-2 pt-5">
              <div className="grid w-full grid-cols-5 gap-1 p-1 ring-1  ring-primary first-letter:uppercase sm:grid-cols-6">
                <span className="col-span-3 first-letter:uppercase">item</span>
                <span className="first-letter:uppercase">amount</span>
                <span className="first-letter:uppercase">price</span>
                <span className="hidden first-letter:uppercase sm:inline-block">
                  total
                </span>
              </div>
              {o.amounts.map((a, i) => (
                <div
                  key={i}
                  className="grid w-full grid-cols-5 gap-1 p-1 font-normal ring-1 ring-primary sm:grid-cols-6"
                >
                  <span className="col-span-3 overflow-clip text-sm md:text-base">
                    {a.item}
                  </span>
                  <span className="overflow-clip text-sm md:text-base">
                    {a.amount}
                  </span>
                  <span className="text-sm uppercase md:text-base">
                    {a.price * selectedCurrency.rate}&nbsp;
                    {selectedCurrency.name}
                  </span>
                  <span className="hidden text-sm uppercase sm:inline-block md:text-base">
                    {a.amount * a.price}&nbsp;{selectedCurrency.name}
                  </span>
                </div>
              ))}
              <span className="flex items-center justify-end p-2 text-sm md:text-base">
                Overall&nbsp;{calcTotal(o.amounts)}
                <span className="flex items-center uppercase">
                  &nbsp;{selectedCurrency.name}
                </span>
              </span>
              <div
                className={`flex ${o.status !== "canceled" ? "justify-between" : "items-center justify-end"} mt-4`}
              >
                {o.status !== "shipping" && o.status !== "canceled" ? (
                  <Button
                    text="Cancel Order"
                    title="Cancel Order"
                    fn={() => {
                      setShow(true);
                    }}
                    bgColor="bg-secondary text-sm"
                    size="md:text-base text-sm"
                  />
                ) : (
                  <></>
                )}
                {o.status === "pendingPayment" ? (
                  <Button
                    text="proceed to payment"
                    title="pay"
                    link={`/lipps/${o.id}?c=${selectedCurrency.name}`}
                    size="md:text-base text-sm"
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Notification
        {...notify}
        onAnimEnd={() => {
          setNotify({ error: false, message: "", show: false });
        }}
      />
    </>
  );
};
