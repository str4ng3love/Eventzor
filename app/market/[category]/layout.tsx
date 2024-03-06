"use client";

import Button from "@/app/components/dynamic/Button";
import DropDown from "@/app/components/dynamic/DropDown";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const choppedPath = [...path.split("/")];
  const [selected, setSelected] = useState(
    choppedPath[choppedPath.length - 1].replaceAll("-", " "),
  );
  const [range, setRange] = useState(10);
  const [asc, setAsc] = useState(true);
  const router = useRouter();

  const handleSetRange = (e: React.MouseEvent) => {
    setRange(parseInt(e.currentTarget.innerHTML));
    const searchParams = new URLSearchParams({
      page: "1",
      range: e.currentTarget.innerHTML,
      order: asc ? "asc" : "desc",
    });
    router.push(
      `/market/${selected?.toLowerCase().replace(" ", "-")}` +
        "?" +
        searchParams,
    );
  };
  return (
    <>
      <div className="mb-9 mt-12 flex w-full flex-col justify-between bg-gradient-to-bl from-primary to-slate-300 pb-20 shadow-[0rem_0rem_1rem_black] ring-2 ring-primary dark:to-slate-900 xl:w-[75%]">
        <div className="flex justify-center bg-black/50 p-4 lg:justify-start">
          <div className="grid w-fit grid-cols-2 justify-center gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <Button
              setW={`w-[13ch]`}
              title={`All items ${asc ? "ascending" : "descending"}`}
              text={`All Items`}
              Icon={asc ? FaArrowDown : FaArrowUp}
              active={selected?.toLowerCase() === "all items"}
              fn={(e) => {
                let searchParams;
                if (selected?.toLowerCase() === "all items") {
                  searchParams = new URLSearchParams({
                    page: `1`,
                    range: `${range}`,
                    order: `${asc ? "desc" : "asc"}`,
                  });
                  setAsc(!asc);
                } else {
                  setSelected(e.currentTarget.innerHTML.split("<")[0]);
                  setAsc(true);
                  searchParams = new URLSearchParams({
                    page: `1`,
                    range: `${range}`,
                    order: "asc",
                  });
                }
                router.push("/market/all-items" + "?" + searchParams, {
                  scroll: false,
                });
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
                let searchParams;
                if (selected?.toLowerCase() === "popular") {
                  searchParams = new URLSearchParams({
                    page: `1`,
                    range: `${range}`,
                    order: `${asc ? "desc" : "asc"}`,
                  });
                  setAsc(!asc);
                } else {
                  setSelected(e.currentTarget.innerHTML.split("<")[0]);
                  setAsc(true);
                  searchParams = new URLSearchParams({
                    page: `1`,
                    range: `${range}`,
                    order: "asc",
                  });
                }
                router.push("/market/popular" + "?" + searchParams, {
                  scroll: false,
                });
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
                let searchParams;
                if (selected?.toLowerCase() === "most liked") {
                  searchParams = new URLSearchParams({
                    page: `1`,
                    range: `${range}`,
                    order: `${asc ? "desc" : "asc"}`,
                  });
                  setAsc(!asc);
                } else {
                  setSelected(e.currentTarget.innerHTML.split("<")[0]);
                  setAsc(true);
                  searchParams = new URLSearchParams({
                    page: `1`,
                    range: `${range}`,
                    order: "asc",
                  });
                }
                router.push("/market/most-liked" + "?" + searchParams, {
                  scroll: false,
                });
              }}
              bgColor="bg-link"
            />
            <Button
              setW={`w-[13ch]`}
              title={`Preorders ${asc ? "ascending" : "descending"}`}
              text="Preorders"
              Icon={asc ? FaArrowDown : FaArrowUp}
              active={selected?.toLocaleLowerCase() === "preorders"}
              fn={(e) => {
                let searchParams;
                if (selected?.toLowerCase() === "preorders") {
                  searchParams = new URLSearchParams({
                    page: `1`,
                    range: `${range}`,
                    order: `${asc ? "desc" : "asc"}`,
                  });
                  setAsc(!asc);
                } else {
                  setSelected(e.currentTarget.innerHTML.split("<")[0]);
                  setAsc(true);
                  searchParams = new URLSearchParams({
                    page: `1`,
                    range: `${range}`,
                    order: "asc",
                  });
                }
                router.push("/market/preorders" + "?" + searchParams, {
                  scroll: false,
                });
              }}
              bgColor="bg-link"
            />
            <div className="flex items-center justify-center ">
              <DropDown
                fn={(e) => {
                  handleSetRange(e);
                }}
                items={["10", "25", "50"]}
                title={`show: ${range}`}
                size="text-sm"
                bgColor=""
              />
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
