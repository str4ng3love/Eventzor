"use client";
import { Combobox } from "@headlessui/react";
import { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Icon from "../static/Icon";
import Portal from "../Portal";
import Link from "next/link";

const Search = () => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [canFetch, setCanFetch] = useState(true);
  const [show, setShow] = useState(false)
  const [query, setQuery] = useState<string|null>(null);
  const [results, setResults] = useState<{
    users: { id: string; name: string }[];
    events: { id: string; title: string }[];
    orders: { id: string; item: string }[];
  } | null>(null);

  const search = async (query: string) => {
    if (canFetch && query.length >= 1) {
      setCanFetch(false);
      try {
        const resp = await fetch(
          "/api/search?" + new URLSearchParams({ query: query })
        );
        const data = await resp.json();

        setResults(data);
      } catch (error) {
        console.log(error);
      }

      setCanFetch(true);
    } else {
      return;
    }
  };

  return (<>
    <div
      className="relative group text-text_inactive flex py-2 w-full hover:text-white "
      onClick={() => {
        setShow(true)
        inputEl.current?.focus();
      }}
    >
      <Icon
        textColor="text-text_inactive group-hover:text-white"
        Icon={FaSearch}
      />
      <span className={
        "w-40 bg-inherit focus:text-text focus:ring-0 focus:outline-none focus:bg-bg p-2 rounded-md transition-all duration-500"
      }>Search ...</span>
    </div>
    {show ? <Portal child={
      <Combobox>
        <div className="relative flex flex-col">
          <div className="flex">
            <Icon
              textColor="text-text_inactive group-hover:text-white"
              Icon={FaSearch}
            />
            <Combobox.Input
              ref={inputEl}
              className={
                "w-full bg-inherit focus:text-text focus:ring-0 focus:outline-none focus:bg-bg p-2 rounded-md transition-all duration-500 col-span-1"
              }
              placeholder="Search ..."
              displayValue={(query: string) => query ?? ""}
              onChange={(e) => {
         
                  search(e.currentTarget.value);
                
              }}
              onPaste={(e) => {
           
                  search(e.currentTarget.value);
                
              }}
            />
          </div>
          <Combobox.Options static className={`flex flex-col gap-1w-full bg-bg p-1 ring-2 ring-primary mt-5 h-96 overflow-auto`}>
            {results?.events && results?.events.length > 0 ? <span className={`p-1 pt-4 text-base font-semibold`}>Events :</span> : null}
            {results?.events.map((e) => (
              <Link  key={e.id} onClick={() => setShow(false)} href={`/event/${e.title}`}>
                <Combobox.Option className={`text-sm indent-2 hover:bg-link transition-all duration-150 cursor-pointer mt-1`} value={e.title}>{e.title}</Combobox.Option>
              </Link>
            ))}
            {results?.orders && results?.orders.length > 0 ? <span className={`p-1 pt-4 text-base font-semibold`}>Orders :</span> : null}
            {results?.orders.map((o) => (
              <Link  key={o.id} onClick={() => setShow(false)} href={`/#`}>
                <Combobox.Option className={`text-sm indent-2 hover:bg-link transition-all duration-150 cursor-pointer mt-1`} value={o.item}>{o.item}</Combobox.Option>
              </Link>
            ))}
            {results?.users && results?.users.length > 0 ? <span className={`p-1 pt-4 text-base font-semibold`}>Users :</span> : null}
            {results?.users.map((u) => (
              <Link key={u.id}  onClick={() => setShow(false)} href={`/users/${u.name}`}>
                <Combobox.Option className={`text-sm indent-2 hover:bg-link transition-all duration-150 cursor-pointer mt-1`} value={u.name}>{u.name}</Combobox.Option>
              </Link>
            ))}
            
          </Combobox.Options>
        </div>
      </Combobox>
    }
      cleanUp={() => setShow(false)}

    /> : null}
  </>
  );
};

export default Search;
