"use client";

import { Event } from "@prisma/client";
import { useState } from "react";
import Button from "../Button";
import PaginationButtons from "../PaginationButtons";
import { useRouter } from "next/navigation";
import DropDown from "../DropDown";
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

import EventComponent from "./EventComponents";

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
  const [range, setRange] = useState(currentRange)
  const [asc, setAsc] = useState(orderAsc)


  const handleSetRange = (e: React.MouseEvent) => {
    setRange(parseInt(e.currentTarget.innerHTML));
    const searchParams = new URLSearchParams({ page: '1', range: e.currentTarget.innerHTML, order: asc ? "asc" : "desc" });
    router.push(`/events/${selected?.toLowerCase().replace(" ", "-")}` + "?" + searchParams, { scroll: false })
  }

  return (<>
    <div className="xl:w-[75%] w-full mb-9 bg-gradient-to-bl from-primary to-slate-900 ring-2 ring-primary flex flex-col justify-between shadow-[0rem_0rem_1rem_black] mt-12 pb-20">
      <div className="bg-black/50 p-4 flex justify-center lg:justify-start">
        <div className="grid lg:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-2 justify-center w-fit">
          <Button
            setW={`w-[13ch]`}
            title={`All items ${asc ? "ascending" : "descending"}`}
            text={`All Items`}
            Icon={asc ? FaArrowDown : FaArrowUp}
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
            setW={`w-[13ch]`}

            title={`Popular ${asc ? "ascending" : "descending"}`}
            text="Popular"
            Icon={asc ? FaArrowDown : FaArrowUp}
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
            setW={`w-[13ch]`}
            title={`Most liked  ${asc ? "ascending" : "descending"}`}
            text="Most Liked"
            Icon={asc ? FaArrowDown : FaArrowUp}
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
            setW={`w-[13ch]`}
            title={`Upcoming ${asc ? "ascending" : "descending"}`}
            text="Upcoming"
            Icon={asc ? FaArrowDown : FaArrowUp}
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
            setW={`w-[13ch]`}
            title={`Sales Ending ${asc ? "ascending" : "descending"}`}
            text="Sales Ending"
            Icon={asc ? FaArrowDown : FaArrowUp}
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
        {events.map((e, index) =>
          <EventComponent key={index} event={e} />)}
      </div>

    </div>
    {count > 10 ?
      <div className="p-2 bg-black/50 justify-center items-center flex gap-2 -translate-y-24 ">

        <PaginationButtons handleClick={(e, i) => {
          setPage(i); let searchParams = new URLSearchParams({ page: `${i}`, range: `${range}`, order: asc ? "asc" : "desc" });

          router.push(`/events/${selected?.toLowerCase().replace(" ", "-")}` + "?" + searchParams, { scroll: false })
        }
        }
          count={count} limit={range} activePage={page} />

      </div> : <></>}</>
  );
};

export default EventsBrowser;
