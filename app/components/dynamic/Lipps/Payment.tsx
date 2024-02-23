"use client";

interface Props {
  id: string;
  orders: ParsedOrder;
}

import { useEffect, useState } from "react";
import Button from "../Button";
import { ParsedOrder } from "@/types/interfaces";
import SpinnerMini from "../../static/SpinnerMini";
import Notification from "../../static/Notification";
import { useRouter } from "next/navigation";

const Payment = ({ id, orders }: Props) => {
  const [selectedCurrency, setSelectedCurrency] = useState<{
    name: string;
    rate: number;
  }>();
  const [total, setTotal] = useState<number>();
  const [processing, setProcessing] = useState(false);
  const [notify, setNotify] = useState({
    show: false,
    error: false,
    message: "",
  });
  const [count, setCount] = useState(5);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const approvePayment = async () => {
    setProcessing(true);
    try {
      const resp = await fetch(`/api/orders/imagine`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: id }),
      });
      const data: { error?: string; message?: string } = await resp.json();
      if (data.error) {
        let err;
        data.error.includes("Record to update not found.")
          ? (err =
              "Order already processed. You will now be redirected to the Orders page.")
          : (err = data.error);
        setNotify({ error: true, show: true, message: err });
        setProcessing(false);
      } else if (data.message) {
        setNotify({ error: false, show: true, message: data.message });
        setProcessing(false);
        setCompleted(true);
        countedown();
      }
    } catch (error) {
      setNotify({
        error: true,
        show: true,
        message: "Cannot connect to the service, try again later.",
      });
      setProcessing(false);
      console.log(error);
    }
  };
  const countedown = () => {
    const id = setInterval(() => {
      setCount((prev) => (prev -= 1));
      if (count === 0) {
        clearInterval(id);
      }
    }, 1000);
  };
  useEffect(() => {
    const currency = localStorage.getItem("currency");

    if (currency) {
      let selectedCurrency = JSON.parse(currency);
      setSelectedCurrency({
        name: selectedCurrency.name,
        rate: selectedCurrency.rate,
      });
    }
  }, []);
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
  useEffect(() => {
    if (selectedCurrency?.rate) {
      const total = orders?.amounts.reduce((acc, val) => {
        acc = acc + val.price * selectedCurrency?.rate * val.amount;
        return parseFloat(acc.toFixed(2));
      }, 0);
      setTotal(total);
    }
  }, [selectedCurrency]);

  return (
    <>
      <div className="flex flex-col">
        <div className="my-8 flex items-center justify-center">
          <span>Total value of the order&nbsp;:&nbsp;</span>
          {typeof total === "undefined" &&
          typeof selectedCurrency?.name === "undefined" ? (
            <span className="pl-4">
              <SpinnerMini borderSize="border-4" h="h-6" w="w-6" />
            </span>
          ) : (
            <span className="pl-4 text-xl font-semibold">
              {total}&nbsp;{selectedCurrency?.name.toLocaleUpperCase()}
            </span>
          )}
        </div>
        {processing ? (
          <div className="flex flex-col items-center justify-center">
            <span className="p-4 font-semibold">
              Thank you for using L.I.P.P.S. service!
            </span>
            <span className="animate-pulse p-4 text-xl font-semibold">
              Processing your payment.
            </span>
          </div>
        ) : (
          <span className="mx-auto">
            {completed ? (
              <div className="flex animate-fadeIn flex-col items-center justify-center rounded-md bg-primary p-8 shadow-md shadow-black">
                <span className="p-2 py-4 text-xl font-semibold ">
                  Transaction completed.{" "}
                </span>
                <span className="p-2 py-4 text-lg ">
                  Thank You for using LIPPS
                </span>
                <span className="p-1  text-base">
                  You now will be redirected to Orders page in:
                </span>
                <span className="animate-ping py-4 pt-8 text-xl">{count}</span>
              </div>
            ) : (
              <Button
                text="Imagine Paying!"
                title="Pay"
                size="text-xl"
                interactive={!completed}
                fn={() => {
                  approvePayment();
                }}
              />
            )}
          </span>
        )}
      </div>
      <Notification
        show={notify.show}
        error={notify.error}
        message={notify.message}
        onAnimEnd={() => {
          setNotify({ error: false, show: false, message: "" });
          router.replace("/orders");
        }}
      />
    </>
  );
};
export default Payment;
