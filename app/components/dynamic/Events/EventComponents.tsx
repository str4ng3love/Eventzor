"use client";

import { Event } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import SpinnerMini from "../../static/SpinnerMini";
import { useEffect, useState } from "react";
interface Props {
  event: Event;
}
const EventComponent = ({ event }: Props) => {
  const [currency, setCurrency] = useState({ name: "initial", rate: 1 });

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
    <Link
      href={`/event/${event.title}`}
      className="my-1 flex h-20 justify-between from-link via-link_active to-link p-1 ring-2 transition-all duration-300 hover:bg-gradient-to-tl "
    >
      <div className="flex">
        <Image
          style={{ objectFit: "cover", width: "150px", height: "auto" }}
          width={500}
          height={500}
          placeholder="blur"
          blurDataURL={
            "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkOAMAANIAzr59FiYAAAAASUVORK5CYII="
          }
          alt="Event's Image"
          src={event.images[0]}
        />
        <div className="flex flex-col justify-start p-2">
          <span className="overflow-hidden text-ellipsis text-sm sm:text-sm md:text-base">
            {event.title}
          </span>
          <span className=" hidden text-xs sm:inline-block md:text-sm">
            {new Date(event.eventDate).toUTCString().slice(0, -7)}
            &nbsp;GMT
          </span>
        </div>
        <span className="hidden h-full w-40 self-end overflow-clip text-ellipsis p-2 text-sm md:block">
          {event.location}
        </span>
      </div>
      <div className="flex text-sm">
        <span className="hidden whitespace-nowrap p-2 xl:block">
          Available to:&nbsp;
        </span>
        <span className="hidden w-40 self-end p-2 xl:block">
          {new Date(event.closingDate).toUTCString().slice(0, -7)}
          &nbsp;GMT
        </span>
        <span className="hidden justify-end self-center  overflow-hidden text-ellipsis px-2 font-semibold sm:flex lg:text-lg ">
          {currency.name === "initial" ? (
            <SpinnerMini />
          ) : (
            (event.price * currency.rate).toFixed(2)
          )}
          &nbsp;
          {currency.name !== "initial" ? currency.name.toLocaleUpperCase() : ""}
        </span>
      </div>
    </Link>
  );
};
export default EventComponent;
