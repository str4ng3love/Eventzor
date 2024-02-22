"use client";
import { Combobox } from "@headlessui/react";
import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Icon from "../../static/Icon";
import Portal from "../../Portal";
import Link from "next/link";
import SpinnerMini from "../../static/SpinnerMini";
interface Props {
  minimizeOnLg?: boolean
}
const Search = ({ minimizeOnLg }: Props) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [canFetch, setCanFetch] = useState(true);
  const [show, setShow] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()
  const [query, setQuery] = useState<string | null>(null)
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
  const emitEvent = () => {
    const event = new Event("closeBurger")
    window.dispatchEvent(event)
  }
  useEffect(() => {
    clearTimeout(timeoutId)
    const id = setTimeout(() => {
      if (query !== null)
        search(query)
    }, 1000)
    setTimeoutId(id)
  }, [query])
  return (<>
    <button
      className="relative group flex py-2 text-start cursor-pointer"
      onClick={() => {
        setShow(true)
        inputEl.current?.focus();
      }}
    >
      <Icon
        textColor="lg:dark:group-hover:text-text md:group-hover:text-link transition"
        Icon={FaSearch}
      />
      <span className={
        `w-40 z-10 text-text ring-0 outline-none bg-bg p-2 rounded-md group-hover:bg-link transition ${minimizeOnLg ? "hidden" : ""}  lg:inline-block`
      }>Search ...</span>
    </button>
    {show ? <Portal child={
      <Combobox>
        <div className="relative flex flex-col z-10">
          <div className="flex">
            <Icon
              textColor="text-text"
              Icon={FaSearch}
            />
            <Combobox.Input
              ref={inputEl}
              className={
                "w-full bg-inherit focus:ring-0 focus:outline-none focus:bg-bg p-2 rounded-md"
              }
              placeholder="Search ..."
              displayValue={(query: string) => query ?? ""}
              onChange={(e) => {

                setQuery(e.currentTarget.value);

              }}
              onPaste={(e) => {

                setQuery(e.currentTarget.value);

              }}
            />
          </div>
          <Combobox.Options static className={`relative flex flex-col gap-1w-full bg-bg p-1 ring-2 ring-primary mt-5 h-96 overflow-auto`}>
            {results?.events && results?.events.length > 0 ? <span className={`p-1 pt-4 text-base font-semibold`}>Events :</span> : null}
            {results?.events.map((e) => (
              <Link key={e.id} onClick={() => { emitEvent(); setShow(false) }} href={`/event/${e.title}`}>
                <Combobox.Option className={`text-sm indent-2 hover:bg-link transition-all duration-150 cursor-pointer mt-1`} value={e.title}>{e.title}</Combobox.Option>
              </Link>
            ))}
            {results?.items && results?.items.length > 0 ? <span className={`p-1 pt-4 text-base font-semibold`}>Items :</span> : null}
            {results?.items.map((i) => (
              <Link key={i.id} onClick={() => { emitEvent(); setShow(false) }} href={`/item/${i.item}`}>
                <Combobox.Option className={`text-sm indent-2 hover:bg-link transition-all duration-150 cursor-pointer mt-1`} value={i.item}>{i.item}</Combobox.Option>
              </Link>
            ))}
            {results?.users && results?.users.length > 0 ? <span className={`p-1 pt-4 text-base font-semibold`}>Users :</span> : null}
            {results?.users.map((u) => (
              <Link key={u.id} onClick={() => { emitEvent(); setShow(false) }} href={`/users/${u.name}`}>
                <Combobox.Option className={`text-sm indent-2 hover:bg-link transition-all duration-150 cursor-pointer mt-1`} value={u.name}>{u.name}</Combobox.Option>
              </Link>
            ))}
            {results?.users.length === 0 && results?.events.length === 0 && results?.items.length === 0 ? <span className="p-1 text-sm font-thin">No results for query &quot;{query}&quot;</span> : null}
            {!canFetch ?
              <div className="w-full absolute items-center flex justify-center h-full inset-0 backdrop-blur-sm bg-black/20 animate-fadeIn">
                <SpinnerMini borderSize="border-[16px]" w="w-16" h="h-16" />
              </div> : null}
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
