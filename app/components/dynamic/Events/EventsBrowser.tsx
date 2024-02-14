"use client";

import { Event } from "@prisma/client";
import { useEffect, useState } from "react";
import Button from "../Button";
import Link from "next/link";
import Image from "next/image";
import SpinnerMini from "../../static/SpinnerMini";
import PaginationButtons from "../PaginationButtons";
import { useRouter } from "next/navigation";
import DropDown from "../DropDown";
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

interface Props {
  events: Event[];
  count: number;
  currentPage?: number;
  selectedCategory?: string
  orderAsc?: boolean
  currentRange?: number
}


const EventsBrowser = ({ events, count, selectedCategory = "all items", orderAsc = true, currentPage = 1, currentRange = 10 }: Props) => {

  const router = useRouter()

  const [selected, setSelected] = useState(selectedCategory);

  const [page, setPage] = useState(currentPage);
  const [currency, setCurrency] = useState({ name: "initial", rate: 1 });
  const [range, setRange] = useState(currentRange)
  const [asc, setAsc] = useState(orderAsc)


  const handleSetRange = (e: React.MouseEvent) => {
    setRange(parseInt(e.currentTarget.innerHTML));
    const searchParams = new URLSearchParams({ page: '1', range: e.currentTarget.innerHTML, order: asc ? "asc" : "desc" });
    router.push(`/events/${selected?.toLowerCase().replace(" ", "-")}` + "?" + searchParams, { scroll: false })
  }

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
    <div className="lg:w-[75%] w-full mb-9 bg-gradient-to-bl from-primary to-slate-900 ring-2 ring-primary flex flex-col justify-between shadow-[0rem_0rem_1rem_black] mt-12 pb-20">
      <div className="bg-black/50 p-4 flex justify-center md:justify-start">
        <div className="grid md:grid-cols-6 grid-cols-3 gap-2 justify-center w-fit">
          <Button
            title={`All items ${asc ? "ascending" : "descending"}`}
            text={`All Items`}
            Icon={asc ? FaArrowUp : FaArrowDown}
            active={selected?.toLowerCase() === "all items"}
            fn={(e) => {
              let searchParams
              if (selected?.toLowerCase() === "all items") {

                searchParams = new URLSearchParams({ page: `1`, range: `${range}`, order: `${asc ? "desc" : "asc"}` })
                setAsc(!asc)
              } else {
                setSelected(e.currentTarget.innerHTML.split("<")[0]);
                setAsc(true)
                searchParams = new URLSearchParams({ page: `1`, range: `${range}`, order: "asc" })
              }
              router.push("/events/all-items" + "?" + searchParams, { scroll: false });

            }}
            bgColor="bg-link"
          />
          <Button
            title={`Popular ${asc ? "ascending" : "descending"}`}
            text="Popular"
            Icon={asc ? FaArrowUp : FaArrowDown}
            active={selected?.toLowerCase() === "popular"}
            fn={(e) => {
              let searchParams
              if (selected?.toLowerCase() === "popular") {
                searchParams = new URLSearchParams({ page: `1`, range: `${range}`, order: `${asc ? "desc" : "asc"}` })
                setAsc(!asc)
              } else {
                setSelected(e.currentTarget.innerHTML.split("<")[0]);
                setAsc(true)
                searchParams = new URLSearchParams({ page: `1`, range: `${range}`, order: "asc" })
              }
              router.push("/events/popular" + "?" + searchParams, { scroll: false });
            }}
            bgColor="bg-link"
          />
          <Button
            title={`Most liked  ${asc ? "ascending" : "descending"}`}
            text="Most Liked"
            Icon={asc ? FaArrowUp : FaArrowDown}
            active={selected?.toLowerCase() === "most liked"}
            fn={(e) => {
              let searchParams
              if (selected?.toLowerCase() === "most liked") {

                searchParams = new URLSearchParams({ page: `1`, range: `${range}`, order: `${asc ? "desc" : "asc"}` })
                setAsc(!asc)
              } else {
                setSelected(e.currentTarget.innerHTML.split("<")[0]);
                setAsc(true)
                searchParams = new URLSearchParams({ page: `1`, range: `${range}`, order: "asc" })
              }
              router.push("/events/most-liked" + "?" + searchParams, { scroll: false });

            }}
            bgColor="bg-link"
          />
          <Button
            title={`Upcoming ${asc ? "ascending" : "descending"}`}
            text="Upcoming"
            Icon={asc ? FaArrowUp : FaArrowDown}
            active={selected?.toLowerCase() === "upcoming"}
            fn={(e) => {
              let searchParams
              if (selected?.toLowerCase() === "upcoming") {

                searchParams = new URLSearchParams({ page: `1`, range: `${range}`, order: `${asc ? "desc" : "asc"}` })
                setAsc(!asc)
              } else {
                setSelected(e.currentTarget.innerHTML.split("<")[0]);
                setAsc(true)
                searchParams = new URLSearchParams({ page: `1`, range: `${range}`, order: "asc" })
              }
              router.push("/events/upcoming" + "?" + searchParams, { scroll: false });

            }}
            bgColor="bg-link"
          />
          <Button
            title={`Sales Ending ${asc ? "ascending" : "descending"}`}
            text="Sales Ending"
            Icon={asc ? FaArrowUp : FaArrowDown}
            active={selected?.toLocaleLowerCase() === "sales ending"}
            fn={(e) => {
              let searchParams
              if (selected?.toLowerCase() === "sales ending") {

                searchParams = new URLSearchParams({ page: `1`, range: `${range}`, order: `${asc ? "desc" : "asc"}` })
                setAsc(!asc)
              } else {
                setSelected(e.currentTarget.innerHTML.split("<")[0]);
                setAsc(true)
                searchParams = new URLSearchParams({ page: `1`, range: `${range}`, order: "asc" })
              }
              router.push("/events/sales-ending" + "?" + searchParams, { scroll: false });

            }}
            bgColor="bg-link"
          />
          <div className="flex items-center justify-center ">
            <DropDown fn={(e) => { handleSetRange(e) }} items={["10", "25", "50"]} title={`show: ${range}`} size="text-sm" bgColor="" />
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4 justify-start xl:mx-0 mx-2 transition-all duration-300 min-h-[50rem] my-2">

        {events.length > 0 ? (
          events.map((e) => (

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
                  alt="Event's Image"
                  src={e.images[0]}
                />
                <div className="p-2 flex flex-col justify-between">
                  <span className="md:text-base text-sm sm:text-sm overflow-hidden text-ellipsis">
                    {e.title}
                  </span>
                  <span className="self-end md:text-sm text-xs sm:inline-block hidden">
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
                <span className="justify-end self-center font-semibold  px-2 lg:text-lg overflow-hidden text-ellipsis hidden sm:flex ">
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

      </div>

    </div>
    {count > 10 ?
      <div className="p-2 bg-black/50 justify-center items-center flex gap-2 -translate-y-24 ">

        <PaginationButtons handleClick={(e, i) => { setPage(i); let searchParams = new URLSearchParams({ page: `${i}`, range: `${range}`, order: asc ? "asc" : "desc" }); router.push(`/events/${selected?.toLowerCase().replace(" ", "-")}` + "?" + searchParams, { scroll: false }) }} count={count} limit={range} activePage={page} />

      </div> : <></>}</>
  );
};

export default EventsBrowser;
