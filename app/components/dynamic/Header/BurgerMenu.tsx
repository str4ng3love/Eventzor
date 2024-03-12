"use client";

import Currency from "../Currency";
import UserMenu from "../UserMenu";
import Search from "./Search";
import { useEffect, useRef, useState } from "react";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const refEl = useRef<HTMLHtmlElement | null>();
  useEffect(() => {
    const doc = document.querySelector("html");
    refEl.current = doc;
  }, []);
  useEffect(() => {
    if (isOpen) {
      refEl.current?.classList.add("overflow-hidden");
      refEl.current?.classList.add("pr-0");
    } else {
      refEl.current?.classList.remove("overflow-hidden");
      refEl.current?.classList.remove("pr-0");
    }
  }, [isOpen]);
  useEffect(() => {
    window.addEventListener("closeBurger", () => {
      setIsOpen(false);
    });

    return () => window.removeEventListener("closeBurger", () => {});
  }, []);
  return (
    <>
      <button
        aria-label="Burger Menu for smaller screens"
        className={`group z-10 flex flex-col items-center justify-center gap-1 rounded-md p-2 transition md:hidden ${isOpen ? "bg-interactive hover:bg-white" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          aria-hidden
          className={`h-1 w-6 transition ${isOpen ? "translate-y-2 -rotate-45 bg-black" : "rotate-0  bg-interactive group-hover:bg-white"}`}
        ></span>
        <span
          aria-hidden
          className={`h-1 w-6 transition ${isOpen ? "bg-black " : "bg-interactive group-hover:bg-white"} `}
        ></span>
        <span
          aria-hidden
          className={`h-1 w-6 transition ${isOpen ? "-translate-y-2 rotate-45 bg-black" : "rotate-0  bg-interactive group-hover:bg-white"}`}
        ></span>
      </button>
      {isOpen ? (
        <div
          onKeyDown={(e) => {}}
          className="absolute inset-0 left-0 flex h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-sidebar dark:bg-primary md:hidden md:justify-start"
        >
          <Search />
          <Currency />
          <UserMenu />
        </div>
      ) : null}
    </>
  );
};

export default BurgerMenu;
