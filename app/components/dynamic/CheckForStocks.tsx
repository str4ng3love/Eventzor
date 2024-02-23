"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SpinnerMini from "../static/SpinnerMini";
import Notification from "../static/Notification";

interface LowItemStocks {
  id: string;
  amount: number;
  amountSold: number;
  item: string;
}
[];
interface LowTicketStocks {
  id: string;
  tickets: number;
  ticketsSold: number;
  title: string;
}
[];

const CheckForStocks = () => {
  const [lowItemStocks, setLowItemStocks] = useState<LowItemStocks[]>();
  const [lowTicketStocks, setLowTicketStocks] = useState<LowTicketStocks[]>();
  const [notify, setNotify] = useState({
    error: false,
    message: "",
    show: false,
  });
  const checkStocks = async () => {
    try {
      const resp = await fetch("/api/get-stock");
      const data = await resp.json();
      if (data.error) {
        setNotify({ error: true, show: true, message: "" });
      } else {
        setLowItemStocks(data.lowItemStocks);
        setLowTicketStocks(data.lowTicketStocks);
      }
    } catch (error) {
      setNotify({ error: true, show: true, message: "Could not fetch data." });
      console.log(error);
    }
  };
  useEffect(() => {
    (() => {
      checkStocks();
    })();
  }, []);
  if (lowItemStocks === undefined || lowTicketStocks === undefined) {
    return (
      <div className="flex w-full justify-center p-8">
        <SpinnerMini />
      </div>
    );
  }

  return (
    <>
      {lowItemStocks.length > 0 || lowTicketStocks.length > 0 ? (
        <div className="flex flex-col gap-2 p-6">
          <div className="bg-bg_interactive flex flex-col p-4 ring-2 ring-primary">
            <h2>Items stock below 10%</h2>
            <div className="flex w-full flex-col justify-start gap-4  indent-1 sm:gap-2">
              {lowItemStocks.length > 0 ? (
                lowItemStocks.map((i, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between sm:flex-row"
                  >
                    <Link
                      className="flex-grow p-1 transition-all duration-150 hover:bg-link"
                      href={`/item/${i.item}`}
                    >
                      {i.item}
                    </Link>
                    <div className="flex gap-2">
                      <span>Amount:&nbsp;{i.amount}</span>
                      <span>Sold:&nbsp;{i.amountSold}</span>
                    </div>
                  </div>
                ))
              ) : (
                <span>None</span>
              )}
            </div>
          </div>
          <div className="bg-bg_interactive flex flex-col p-4 ring-2 ring-primary">
            <h2>Events with tickets below 10%</h2>
            <div className="flex w-full flex-col justify-start gap-4  indent-1 sm:gap-2">
              {lowTicketStocks.length > 0 ? (
                lowTicketStocks.map((t, index) => (
                  <div
                    key={index}
                    className="justify-betweent flex w-full gap-2"
                  >
                    <Link
                      className="flex-grow p-1 transition-all duration-150 hover:bg-link"
                      href={`/event/${t.title}`}
                    >
                      {t.title}
                    </Link>
                    <div className="flex gap-2">
                      <span>Amount:&nbsp;{t.tickets}</span>
                      <span>Sold:&nbsp;{t.ticketsSold}</span>
                    </div>
                  </div>
                ))
              ) : (
                <span>None</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center p-8">
          <span>Nothing to report</span>
        </div>
      )}
      {notify.show == true ? (
        <Notification
          show={notify.show}
          error={notify.error}
          message={notify.message}
          onAnimEnd={() =>
            setNotify({ show: false, error: false, message: "" })
          }
        />
      ) : null}
    </>
  );
};

export default CheckForStocks;
