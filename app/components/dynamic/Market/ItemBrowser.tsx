"use client";

import { MarketItem } from "@prisma/client";
import PaginationButtons from "../PaginationButtons";
import { usePathname, useSearchParams } from "next/navigation";
import ItemComponent from "./ItemComponent";

interface Props {
  items: MarketItem[];
  count: number;
}

const ItemsBrowser = ({ items, count }: Props) => {
  const path = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const range = searchParams.get("range");
  const order = searchParams.get("order");

  return (
    <>
      <div className="mx-2 my-2 flex min-h-[50rem] flex-col justify-start p-4 transition-all duration-300 xl:mx-0">
        {items.map((i, index) => (
          <ItemComponent key={index} item={i} />
        ))}
      </div>
      {count > 10 ? (
        <div className="flex translate-y-12 items-center justify-center gap-2 bg-black/50 p-2 ">
          <PaginationButtons
            order={order as string}
            path={path}
            count={count}
            limit={parseInt(range as string)}
            activePage={parseInt(page as string)}
          />
        </div>
      ) : null}
    </>
  );
};

export default ItemsBrowser;
