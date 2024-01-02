"use client";

import { Event } from "@prisma/client";
import { useEffect, useState } from "react";
import Button from "../Button";
import Link from "next/link";
import Image from "next/image";
import SpinnerMini from "../../static/SpinnerMini";
import PaginationButtons from "../PaginationButtons";
import { useRouter, useSearchParams } from "next/navigation";
import DropDown from "../DropDown";
import placeholder from '@/public/images/placeholder.svg'
interface Props {
  events: Event[];
  count: number;
  selectedCategory?: string
}
// todo: generic- finish up

const EventsBrowser = ({ events, count, selectedCategory }: Props) => {
  const searchParams = useSearchParams()
  let currentPage = searchParams.get("page")
  let currentRange = searchParams.get("range")
  const [eventsArr, setEventsArr] = useState(events);
  const [selected, setSelected] = useState(selectedCategory);
  const [isLoadinig, setIsLoading] = useState(false);
  const [page, setPage] = useState(currentPage ? parseInt(currentPage) : 1);
  const [currency, setCurrency] = useState({ name: "initial", rate: 1 });
  const [range, setRange] = useState(currentRange ? parseInt(currentRange) : 10)
  const router = useRouter()


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
      window.removeEventListener("currency", () => { });
    };
  }, []);
  useEffect(() => {
    setEventsArr(events)
    currentPage = searchParams.get("page")
    setPage(parseInt(currentPage ? currentPage : "1"))
  }, [events])
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

  return (<>
    <div className="lg:w-[75%] w-full bg-gradient-to-bl from-primary to-slate-900 ring-2 ring-primary flex lg:flex-col flex-row justify-between shadow-[0rem_0rem_1rem_black] mt-12 pb-12">
      <div className="bg-black/50 p-4 flex xl:justify-start gap-2 lg:justify-center flex-col lg:flex-row justify-start">

        <Button
          title="All items"
          text="All Items"
          active={selected?.toLowerCase() === "all items"}
          fn={(e) => {
            if (e.currentTarget.innerHTML === selected) {
              return;
            } else {
              setSelected(e.currentTarget.innerHTML);
              let searchParams = new URLSearchParams({ page: `1`, range: `${range}` })
              router.push("/events/all-items" + "?" + searchParams, { scroll: false });
            }
          }}
          bgColor="bg-link"
        />
        <Button
          title="Popular"
          text="Popular"
          active={selected?.toLowerCase() === "popular"}
          fn={(e) => {
            if (e.currentTarget.innerHTML === selected) {
              return;
            } else {
              setSelected(e.currentTarget.innerHTML);
              let searchParams = new URLSearchParams({ page: `1`, range: `${range}` })
              router.push("/events/popular" + "?" + searchParams, { scroll: false });
            }
          }}
          bgColor="bg-link"
        />
        <Button
          title="Most liked"
          text="Most Liked"
          active={selected?.toLowerCase() === "most liked"}
          fn={(e) => {
            if (e.currentTarget.innerHTML === selected) {
              return;
            } else {
              setSelected(e.currentTarget.innerHTML);
              let searchParams = new URLSearchParams({ page: `1`, range: `${range}` })
              router.push("/events/most-liked" + "?" + searchParams, { scroll: false });
            }
          }}
          bgColor="bg-link"
        />
        <Button
          title="Upcoming"
          text="Upcoming"
          active={selected?.toLowerCase() === "upcoming"}
          fn={(e) => {
            if (e.currentTarget.innerHTML === selected) {
              return;
            } else {
              setSelected(e.currentTarget.innerHTML);
              let searchParams = new URLSearchParams({ page: `1`, range: `${range}` })
              router.push("/events/upcoming" + "?" + searchParams, { scroll: false });
            }
          }}
          bgColor="bg-link"
        />
        <Button
          title="Sales ending"
          text="Sales Ending"
          active={selected?.toLocaleLowerCase() === "sales ending"}
          fn={(e) => {
            if (e.currentTarget.innerHTML === selected) {
              return;
            } else {
              setSelected(e.currentTarget.innerHTML);
              let searchParams = new URLSearchParams({ page: `1`, range: `${range}` })
              router.push("/events/sales-ending" + "?" + searchParams, { scroll: false });
            }
          }}
          bgColor="bg-link"
        />
        <div className="flex items-center justify-center ">
          <DropDown fn={(e) => { setRange(parseInt(e.currentTarget.innerHTML)); let searchParams = new URLSearchParams({ range: e.currentTarget.innerHTML}); router.push(`/events/${selected?.toLowerCase().replace(" ", "-")}` + "?" + searchParams, { scroll: false }) }} items={["10", "25", "50"]} title={`show: ${range}`} size="text-sm" bgColor="" />
        </div>
      </div>
      <div className="flex flex-col p-4 justify-start xl:mx-0 mx-2 transition-all duration-300 min-h-[50rem] my-2">
        {isLoadinig ? (
          <div className="flex justify-center items-center mt-10 w-full">
            <SpinnerMini />
          </div>
        ) : (
          <>
            {eventsArr.length > 0 ? (
              eventsArr.map((e) => (
                <Link
                  href={`/event/${e.title}`}
                  className="ring-2 p-1 my-1 hover:bg-gradient-to-tl from-link via-link_active to-link transition-all duration-300 h-20 flex justify-between "
                  key={e.id}
                >
                  <div className="flex">
                    <Image
                      style={{ objectFit: "cover", width: "150px", height: "auto" }}
                      width={500}
                      height={500}
                      placeholder="blur"
                      blurDataURL={"data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkOAMAANIAzr59FiYAAAAASUVORK5CYII="}
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

    </div>
    {count > 10 ?
      <div className="p-2 bg-black/50 justify-center items-center flex gap-2 -translate-y-14">

        <PaginationButtons handleClick={(e, i) => { setPage(i); let searchParams = new URLSearchParams({ page: `${i}`, range: `${range}` }); router.push(`/events/${selected?.toLowerCase().replace(" ", "-")}` + "?" + searchParams, { scroll: false }) }} count={count} limit={range} activePage={page} />

      </div> : <></>}</>
  );
};

export default EventsBrowser;
