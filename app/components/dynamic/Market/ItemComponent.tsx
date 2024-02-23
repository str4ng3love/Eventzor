"use client";

import { MarketItem } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import SpinnerMini from "../../static/SpinnerMini";
import { useEffect, useState } from "react";
interface Props {
  item: MarketItem;
}
const ItemComponent = ({ item }: Props) => {
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
      href={`/item/${item.item}`}
      className="relative my-1 flex h-20 justify-between overflow-hidden from-link via-link_active to-link p-1 ring-2 transition-all duration-300 hover:bg-gradient-to-tl "
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
          alt="Item's Image"
          src={item.images[0]}
        />
        <div className="flex flex-col justify-between p-2">
          <span className="overflow-hidden text-ellipsis text-sm sm:text-sm md:text-base">
            {item.item}
          </span>
          <span className="hidden self-end text-xs sm:inline-block md:text-sm">
            {item.preorder &&
            item.releaseDate &&
            item.releaseDate > new Date(Date.now())
              ? `Available from: ${item.releaseDate.toUTCString().slice(0, -7)}`
              : ""}
          </span>
        </div>
        <span className="hidden h-full w-40 self-end overflow-clip text-ellipsis p-2 text-sm md:block">
          {item.amount ? "In stock" : "out of stock"}
        </span>
      </div>
      <div className="hidden  text-sm sm:flex">
        <span className="flex justify-end self-center  overflow-hidden text-ellipsis px-2 font-semibold lg:text-lg">
          {currency.name === "initial" ? (
            <SpinnerMini />
          ) : (
            (item.price * currency.rate).toFixed(2)
          )}
          &nbsp;
          {currency.name !== "initial" ? currency.name.toLocaleUpperCase() : ""}
        </span>
      </div>
      {item.preorder === true &&
      item.releaseDate !== null &&
      item.releaseDate >= new Date(Date.now()) ? (
        <span className="absolute left-0 top-1/4 flex h-8 w-[8rem] translate-x-[-30%] -rotate-[55deg] items-center justify-center whitespace-nowrap bg-violet-600 p-1 text-lg">
          Preorder
        </span>
      ) : (
        <></>
      )}
    </Link>
  );
};
export default ItemComponent;
