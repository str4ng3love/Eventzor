"use client";
import { Combobox } from "@headlessui/react";
import { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Icon from "../../static/Icon";
import Portal from "../../Portal";
import Link from "next/link";

const Search = () => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [canFetch, setCanFetch] = useState(true);
  const [show, setShow] = useState(false)
  const [results, setResults] = useState<{
    users: { id: string; name: string }[];
    events: { id: string; title: string }[];
    items: { id: string; item: string }[];
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
    <button
      className="relative group text-text_inactive flex py-2 text-start cursor-pointer"
      onClick={() => {
        setShow(true)
        inputEl.current?.focus();
      }}
    >
      <Icon
        textColor="text-text_inactive group-hover:text-white transition-all duration-300"
        Icon={FaSearch}
      />
      <span className={
        "w-40  text-text ring-0 outline-none bg-bg p-2 rounded-md group-hover:text-white transition-all duration-300 md:inline-block"
      }>Search ...</span>
    </button>
    {show ? <Portal child={
      <Combobox>
        <div className="relative flex flex-col">
          <div className="flex">
            <Icon
              textColor="text-text_inactive"
              Icon={FaSearch}
            />
            <Combobox.Input
              ref={inputEl}
              className={
                "w-full bg-inherit group-hover:text-white focus:ring-0 focus:outline-none focus:bg-bg p-2 rounded-md"
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
              <Link key={e.id} onClick={() => setShow(false)} href={`/event/${e.title}`}>
                <Combobox.Option className={`text-sm indent-2 hover:bg-link transition-all duration-150 cursor-pointer mt-1`} value={e.title}>{e.title}</Combobox.Option>
              </Link>
            ))}
            {results?.items && results?.items.length > 0 ? <span className={`p-1 pt-4 text-base font-semibold`}>Items :</span> : null}
            {results?.items.map((i) => (
              <Link key={i.id} onClick={() => setShow(false)} href={`/item/${i.item}`}>
                <Combobox.Option className={`text-sm indent-2 hover:bg-link transition-all duration-150 cursor-pointer mt-1`} value={i.item}>{i.item}</Combobox.Option>
              </Link>
            ))}
            {results?.users && results?.users.length > 0 ? <span className={`p-1 pt-4 text-base font-semibold`}>Users :</span> : null}
            {results?.users.map((u) => (
              <Link key={u.id} onClick={() => setShow(false)} href={`/users/${u.name}`}>
                <Combobox.Option className={`text-sm indent-2 hover:bg-link transition-all duration-150 cursor-pointer mt-1`} value={u.name}>{u.name}</Combobox.Option>
              </Link>
            ))}
            {results?.users.length === 0 && results?.events.length === 0 && results?.items.length === 0 ? <span className="p-1 text-sm font-thin">No results for given query</span> : null}
          </Combobox.Options>
        </div>
      </Combobox>
    }
      cleanUp={() => { setShow(false), setResults(null) }}

    /> : null}
  </>
  );
};

export default Search;
