"use client";

import { MarketItem } from "@prisma/client";
import { useEffect, useState } from "react";
import Button from "../Button";
import Link from "next/link";
import Image from "next/image";
import SpinnerMini from "../../static/SpinnerMini";
import PaginationButtons from "../PaginationButtons";
import { useRouter } from "next/navigation";
import DropDown from "../DropDown";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import ItemComponent from "./ItemComponent";

interface Props {
  items: MarketItem[];
  count: number;
  currentPage?: number;
  selectedCategory?: string;
  orderAsc?: boolean;
  currentRange?: number;
}

const ItemsBrowser = ({
  items,
  count,
  selectedCategory = "all items",
  orderAsc = true,
  currentPage = 1,
  currentRange = 10,
}: Props) => {
  const router = useRouter();
  const [selected, setSelected] = useState(selectedCategory);
  const [page, setPage] = useState(currentPage);
  const [currency, setCurrency] = useState({ name: "initial", rate: 1 });
  const [range, setRange] = useState(currentRange);
  const [asc, setAsc] = useState(orderAsc);

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
      { scroll: false },
    );
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
        <div className="mx-2 my-2 flex min-h-[50rem] flex-col justify-start p-4 transition-all duration-300 xl:mx-0">
          {items.length > 0 ? (
            items.map((i, index) => <ItemComponent key={index} item={i} />)
          ) : (
            <div className="mt-10 flex justify-center">
              <h3>Nothing found</h3>
            </div>
          )}
        </div>
      </div>
      {count > 10 ? (
        <div className="flex -translate-y-24 items-center justify-center gap-2 bg-black/50 p-2 ">
          <PaginationButtons
            handleClick={(e, i) => {
              setPage(i);
              let searchParams = new URLSearchParams({
                page: `${i}`,
                range: `${range}`,
                order: asc ? "asc" : "desc",
              });
              router.push(
                `/market/${selected?.toLowerCase().replace(" ", "-")}` +
                  "?" +
                  searchParams,
                { scroll: false },
              );
            }}
            count={count}
            limit={range}
            activePage={page}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ItemsBrowser;
