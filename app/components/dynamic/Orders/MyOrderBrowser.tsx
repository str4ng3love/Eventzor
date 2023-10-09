"use client";

import { StatusOrder } from "@prisma/client";
import { useEffect, useState } from "react";
import SpinnerMini from "../../static/SpinnerMini";
import Button from "../Button";
import Notification from "../../static/Notification";

export const MyOrderBrowser = () => {
  const [show, setShow] = useState(false);
  const [notify, setNotify] =useState({message:'', show:false, error:false })
  const [ordersArr, setOrdersArr] = useState<
    {
      total: number;
      id: string;
      buyerName: string;
      status: StatusOrder;
      currency: string;
      phoneNumber: number | null;
      shippingAddress: string;
      amounts: { id: string; item: string; amount: number; price: number }[];
    }[]
  >();
  const [currency, setCurrency] = useState({ name: "usd", rate: 1 });

  const [total, setTotal] = useState<number[]>();

  const cancelOrder = async (id: string) => {
    
    const rollback = ordersArr? [...ordersArr] : []
    setOrdersArr((prev)=> prev?.filter(o=>o.id !==id))
    try {
      const resp = await fetch("/api/orders/my_orders", {
        method: "DELETE",
        body: JSON.stringify({id}),
        headers: { "Content-Type": "application/json" },
      });
      const message =  await resp.json()
      if(message.error){
        setNotify({error:true, message:'Something went wrong, try again later', show:true})
        setOrdersArr(rollback)
      } else {
        setNotify({error:false, message:message.message, show:true})
      }
    } catch (error) {
      setOrdersArr(rollback)
      console.log(error);
    }
  };
  const getOrders = async () => {
    try {
      const resp = await fetch("/api/orders/my_orders");
      const orders = await resp.json();
      if (orders.error) {
      } else {
        const orderStringify = JSON.stringify(orders);
        const ordersParsed = JSON.parse(orderStringify);
        setOrdersArr(ordersParsed);
      }
    } catch (error) {}
  };
  const calcTotal = (
    arr: { amounts: { price: number; amount: number }[] }[]
  ) => {
    const total = arr.map((a) =>
      a.amounts.reduce((acc, val) => {
        acc = acc + val.price * currency.rate * val.amount;
        return parseFloat(acc.toFixed(2));
      }, 0)
    );
    setTotal(total);
  };
  useEffect(() => {
    (async () => {
      await getOrders();
    })();
  }, []);
  useEffect(() => {
    window.addEventListener("currency", () => {
      const currency = localStorage.getItem("currency");
      if (currency) {
        let selectedCurrency = JSON.parse(currency);
        setCurrency({
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
    if (ordersArr) calcTotal(ordersArr);
  }, [ordersArr]);

  if (ordersArr === null || ordersArr === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100dvh_-_30%)]">
        <SpinnerMini h="h-32" w="w-32" borderSize="border-[1rem]" />
      </div>
    );
  }
  return (<>
    <div className="p-4 text-sm">
      <div className="flex gap-4 items-center">
        <span>Your Orders :&nbsp;</span>
        <span>{ordersArr.length}</span>
        {!show ? (
          <Button
            size="1em"
            text="show"
            title="show my orders"
            fn={() => setShow(true)}
          />
        ) : (
          <Button
            size="1em"
            text="hide"
            title="show my orders"
            fn={() => setShow(false)}
          />
        )}
      </div>
      <div className="flex gap-2"></div>

      {show ? (
        <>
          {ordersArr.length ? (
            ordersArr?.map((o, i) => (
              <div key={o.id} className="flex mt-4 bg-black/25 w-fit">
                <div className="p-2">
                  <div className="flex gap-2">
                    <span className="p-1">Order ID:</span>
                    <span className="p-1">{o.id}</span>
                  </div>
                  <span className="p-1">Items:</span>
                  <div className="group h-fit ">
                    {o.amounts.length > 0 ? (
                      o.amounts.map(
                        (a: {
                          id: string;
                          item: string;
                          amount: number;
                          price: number;
                        }) => (
                          <div
                            key={a.id}
                            className="p-2 my-1 font-normal flex gap-2 justify-between w-[25rem] text-sm ring-2 ring-primary "
                          >
                            <span className="p-1 w-[20ch] overflow-hidden text-ellipsis">
                              {a.item}
                            </span>
                            <span className="p-1 w-[4ch] flex justify-end">
                              {a.amount}
                            </span>
                            <span className="p-1 w-[10ch] flex justify-end uppercase">
                              {a.price} &nbsp; {currency.name}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex gap-2 justify-between w-[25rem]">
                    <span className="p-1 w-[24ch]">Total:</span>
                    <span className="p-1 uppercase ">
                      {total ? total[i] : null}&nbsp;{currency.name}
                    </span>
                  </div>
                  <div className="flex gap-2 justify-between">
                    <span className="p-1">Status:</span>
                    <span className="p-1">{o.status}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-4 p-8">
                  <Button text="Continue" title="CONTINUE" fn={() => {}} />
                  <Button
                    text="Cancel"
                    title="cancel"
                    bgColor="bg-secondary"
                    fn={() => {cancelOrder(o.id)}}
                  />
                </div>
              </div>
            ))
          ) : (
            <span className="w-full h-7 p-4 flex items-center justify-center">
              You have no open orders
            </span>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
    <Notification {...notify} onAnimEnd={()=>{setNotify({error:false, message:'', show:false})}} />
    </>
  );
};
