"use client";

import { Order, Prisma } from "@prisma/client";
import { useEffect, useState } from "react";

interface Props {
  orders?: Order[];
}
export const OrderBrowser = ({}: Props) => {
  const [orders, setOrders] = useState<Order[]>();
    const [currency, setCurrency]=useState('usd')
  const getOrders = async () => {
    try {
      const resp = await fetch("/api/orders/my_orders");
      const orders = await resp.json();
      if (orders.error) {
      } else {
        console.log(orders);
        setOrders(orders);
      }
    } catch (error) {}
  };
  useEffect(() => {
    (async () => {
      await getOrders();
    })();
  }, []);
  return (
    <div>
      <span>Orders :</span>
      {orders?.map((o) => (
        <div key={o.id} className="flex flex-col mt-4">
          <div className="p-2 bg-black/25">
            <div className="flex gap-2">
                <span>order ID:</span>
                <span>{o.id}</span>
            </div>
            <span>items:</span>
            {/* @ts-ignore */}
            {o.amounts &&typeof o?.amounts === "object" && Array.isArray(o.amounts) ? (o.amounts.map((a) => <div key={a.id} className="flex gap-2"><span className="w-[20ch]">{a.item}</span><span className="w-[4ch] flex justify-end">{a.amount}</span><span className="w-[20ch] flex justify-end">{a.price}</span><span className="w-[20ch]">{currency}</span></div>)) : (
              <></>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
