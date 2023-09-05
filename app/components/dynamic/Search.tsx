"use client";
import { Combobox } from "@headlessui/react";
import { useState, useRef, useEffect, Fragment } from "react";
import { FaSearch } from "react-icons/fa";
import Icon from "../static/Icon";

const Search = () => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [canFetch, setCanFetch] = useState(true);
  const [selected, setSelected] = useState();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    users: { id: string; username: string }[];
    events: { id: string; title: string }[];
    orders: { id: string; item: string }[];
  }|null>(null);

  const search = async (query: string) => {
    console.log(canFetch && query.length >= 3);
    if (canFetch && query.length >= 3) {
      setCanFetch(false);
      console.log("fetching");
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

  return (
    <div
      className="group text-text_inactive flex py-2 w-full hover:text-white "
      onClick={() => {
        inputEl.current?.focus();
      }}
    >
       {/* TODO: apply routing to /selected */}
      <Combobox  onChange={()=>console.log('hit')}>
        <div className="relative flex">
          <Icon
            textColor="text-text_inactive group-hover:text-white"
            Icon={FaSearch}
          />
          <Combobox.Input
            ref={inputEl}
            className={
              "w-40 bg-inherit focus:text-text focus:ring-0 focus:outline-none focus:bg-bg p-2 rounded-md transition-all duration-500"
            }
            placeholder="Search ..."
            displayValue={(query: string) => query ?? ""}
            onChange={(e) => {
              setQuery(e.currentTarget.value);
              if (canFetch) {
                search(query);
              }
            }}
            onPaste={(e) => {
              setQuery(e.currentTarget.value);
              if (canFetch) {
                search(query);
              }
            }}
          />
          <Combobox.Options className={`absolute bottom-0 translate-y-[100%] w-full bg-bg p-1 ring-2 ring-primary`}>
            {results?.events.map((e) => (
              <Combobox.Option key={e.id} value={e.title}>{e.title}</Combobox.Option>
            ))}
            {results?.orders.map((o) => (
              <Combobox.Option key={o.id} value={o.item}>{o.item}</Combobox.Option>
            ))}
            {results?.users.map((u) => (
              <Combobox.Option key={u.id} value={u.username}>{u.username}</Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
};

export default Search;
