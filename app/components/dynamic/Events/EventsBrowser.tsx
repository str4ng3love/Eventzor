"use client";

import { Event } from "@prisma/client";
import { useEffect, useState } from "react";
import Button from "../Button";
import Link from "next/link";
import Image from "next/image";
import SpinnerMini from "../../static/SpinnerMini";

interface Props {
  events: Event[];
}
// todo: generic- finish up

const EventsBrowser = ({ events }: Props) => {
  const [eventsArr, setEventsArr] = useState(events);
  const [selected, setSelected] = useState("Newest");
  const [isLoadinig, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsAmount, setItemsAmount] = useState(10);
  const [currency, setCurrency] = useState({ name: "initial", rate: 1 });

  const getEvents = async (kind: string, limit: number, page: number) => {
    setIsLoading(true);
    const skip = (page - 1) * limit;
    const search = new URLSearchParams({
      take: limit.toString(),
      skip: skip.toString(),
    });
    const route = kind.replaceAll(" ", "-").toLocaleLowerCase() + "?";
    try {
      const resp = await fetch(encodeURI(`/api/events/${route}` + search));
      const events = await resp.json();

      setEventsArr(events);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    window.addEventListener("currency", () => {
      const currency = localStorage.getItem("currency");
      if (currency) {
        let selectedCurrency = JSON.parse(currency);
        setCurrency({
          name: selectedCurrency.name,
          rate: selectedCurrency.rate,
        });
      } else {
        setCurrency({
          name: "usd",
          rate: 1,
        });
      }
    });
    return () => {
      window.removeEventListener("currency", () => {});
    };
  }, []);
  useEffect(() => {
    let prefCurrency = localStorage.getItem("currency");
    if (prefCurrency) {
      let selectedCurrency = JSON.parse(prefCurrency);
      setCurrency({
        name: selectedCurrency.name,
        rate: selectedCurrency.rate,
      });
    }
    if (!prefCurrency) {
      setCurrency({
        name: "usd",
        rate: 1,
      });
    }
  }, []);
  return (
    <div className="lg:w-[75%] w-full bg-gradient-to-bl from-primary to-slate-900 ring-2 ring-primary flex lg:flex-col my-2 flex-row justify-between shadow-[0rem_0rem_1rem_black]">
      <div className="bg-black/50 p-4 flex xl:justify-start gap-2 lg:justify-center flex-col lg:flex-row justify-start">
        <Button
          title="Newest"
          text="Newest"
          fn={(e) => {
            if (e.currentTarget.innerHTML === selected) {
              return;
            } else {
              setSelected(e.currentTarget.innerHTML);
              getEvents(e.currentTarget.innerHTML, itemsAmount, page);
            }
          }}
          bgColor={selected === "Newest" ? "bg-link underline" : "bg-link"}
        />
        <Button
          title="All items"
          text="All Items"
          fn={(e) => {
            if (e.currentTarget.innerHTML === selected) {
              return;
            } else {
              setSelected(e.currentTarget.innerHTML);
              getEvents(e.currentTarget.innerHTML, itemsAmount, page);
            }
          }}
          bgColor={selected === "All Items" ? "bg-link underline" : "bg-link"}
        />
        <Button
          title="Popular"
          text="Popular"
          fn={(e) => {
            if (e.currentTarget.innerHTML === selected) {
              return;
            } else {
              setSelected(e.currentTarget.innerHTML);
              getEvents(e.currentTarget.innerHTML, itemsAmount, page);
            }
          }}
          bgColor={selected === "Popular" ? "bg-link underline" : "bg-link"}
        />
        <Button
          title="Most liked"
          text="Most Liked"
          fn={(e) => {
            if (e.currentTarget.innerHTML === selected) {
              return;
            } else {
              setSelected(e.currentTarget.innerHTML);
              getEvents(e.currentTarget.innerHTML, itemsAmount, page);
            }
          }}
          bgColor={selected === "Most Liked" ? "bg-link underline" : "bg-link"}
        />
        <Button
          title="Upcoming"
          text="Upcoming"
          fn={(e) => {
            if (e.currentTarget.innerHTML === selected) {
              return;
            } else {
              setSelected(e.currentTarget.innerHTML);
              getEvents(e.currentTarget.innerHTML, itemsAmount, page);
            }
          }}
          bgColor={selected === "Upcoming" ? "bg-link underline" : "bg-link"}
        />
        <Button
          title="Sales ending"
          text="Sales Ending"
          fn={(e) => {
            if (e.currentTarget.innerHTML === selected) {
              return;
            } else {
              setSelected(e.currentTarget.innerHTML);
              getEvents(e.currentTarget.innerHTML, itemsAmount, page);
            }
          }}
          bgColor={
            selected === "Sales Ending" ? "bg-link underline" : "bg-link"
          }
        />
      </div>
      <div className="flex flex-col p-4 justify-start xl:mx-0 mx-2 transition-all duration-300 h-[50rem]">
        {isLoadinig ? (
          <div className="flex justify-center items-center mt-10 w-full">
            <SpinnerMini />
          </div>
        ) : (
          <>
            {eventsArr.length > 0 ? (
              eventsArr.map((e) => (
                <Link
                  href={`/events/${e.title}`}
                  className="ring-2 p-1 my-1 hover:bg-gradient-to-tl from-link via-link_active to-link transition-all duration-300 h-20 flex justify-between "
                  key={e.id}
                >
                  <div className="flex">
                    <Image
                      style={{ objectFit: "cover" }}
                      width={150}
                      height={150}
                      placeholder="blur"
                      blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
                      alt="Events Image"
                      src={e.images[0]}
                    />
                    <div className="p-2 flex flex-col justify-between w-64">
                      <span className="overflow-hidden text-ellipsis sm:text-sm">
                        {e.title}
                      </span>
                      <span className="self-end md:text-sm text-xs">
                        {new Date(e.eventDate).toUTCString().slice(0, -7)}
                        &nbsp;GMT
                      </span>
                    </div>
                    <span className="self-end text-sm w-40 p-2 h-full hidden md:block overflow-clip text-ellipsis">
                      {e.location}
                    </span>
                  </div>
                  <div className="text-sm flex">
                    <span className="p-2 whitespace-nowrap xl:block hidden">
                      Available to:&nbsp;
                    </span>
                    <span className="self-end w-40 p-2 xl:block hidden">
                      {new Date(e.closingDate).toUTCString().slice(0, -7)}
                      &nbsp;GMT
                    </span>
                    <span className="flex justify-end self-center font-semibold w-[20ch] px-2 lg:text-lg overflow-hidden text-ellipsis">
                      {currency.name === "initial" ? (
                        <SpinnerMini />
                      ) : (
                        (e.price * currency.rate).toFixed(2)
                      )}
                      &nbsp;
                      {currency.name !== "initial"
                        ? currency.name.toLocaleUpperCase()
                        : ""}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex justify-center mt-10">
                <h3>Nothing found</h3>
              </div>
            )}
          </>
        )}
      </div>
      {eventsArr.length > 10 ? (
        <div className="p-2 bg-black/50">pagination</div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default EventsBrowser;
