"use client";
import { useState } from "react";
import OrderComponent from "./OrderComponent";
import AddOrder from "./AddOrder";
import OrderSkeleton from "../../static/OrderSkeleton";
import { Order } from "@prisma/client";
interface Props {
  orders: Order[];
}
export const OrderBrowser = ({ orders }: Props) => {
  const [ordersArr, setOrdersArr] = useState(orders);
  const [optimisticComp, setOptimisticComp] = useState(false);

  return (
    <>
      <div className="my-4 px-8 flex flex-col">
        <div className="flex justify-end gap-4 text-sm items-center">
          <AddOrder
            fn={(e) => {
              setOptimisticComp(true);
              // fetch
            }}
          />
        </div>
        <table className="my-8  w-full text-sm table">
          <tbody className="">
            <tr className="border-b-2 border-black/25 bg-black/40 table-row">
              <th className="p-2 text-start">Item</th>
              <th className="p-2 text-start">Price</th>
              <th className="p-2 text-start">Amount</th>
              <th className="p-2 text-start"></th>
            </tr>
            {ordersArr.length > 0 ? (
              ordersArr.map((order) => (
                <OrderComponent {...order} delFn={() => {}} editFn={() => {}} />
              ))
            ) : (
              <tr className="w-full flex justify-center p-8">
                <td>No Orders in Database</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
