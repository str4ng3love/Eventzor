"use client";
import { Combobox, Transition } from "@headlessui/react";
import { useState, Fragment, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Icon from "../Icon";
const Search = () => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState();
  const [query, setQuery] = useState("");
  return (
    <div className="flex py-2 w-full hover:text-white " onClick={()=>{ inputEl.current?.focus()}}>
      <Combobox>
        <Icon textColor="text-text_interactive dark:text-text" Icon={FaSearch} />
        <Combobox.Input
          ref={inputEl}
            id="s"
          className={
            "w-40 bg-inherit focus:text-text focus:ring-0 focus:outline-none focus:bg-bg p-2 rounded-md transition-all duration-500"
          }
          placeholder="Search ..."
          displayValue={(query) => query as string}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
      </Combobox>
    </div>
  );
};

export default Search;
