"use client";
import Logo from "../../static/Logo";
import Nav from "./Nav";

import { FaIcons } from "react-icons/fa";
import SingOut from "./SingOut";
import { useState } from "react";
import Button from "../Button";
import { LuPanelTopClose } from "react-icons/lu";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <aside
      className={`md:translate-x-0  ${isOpen ? "translate-x-0 flex-col" : "-translate-x-[100%]"} text-interactive_text fixed  top-[4rem] z-10 mr-1 flex h-[calc(100dvh_-_4rem)] w-full flex-col items-center justify-evenly bg-black p-8 transition-all  duration-300 before:absolute before:left-16 before:top-0 before:-z-10 before:h-36 before:w-36 before:bg-gradient-radial before:from-red-600/20 before:via-transparent before:to-transparent before:content-[''] after:absolute after:left-14 after:top-2 after:-z-10 after:h-36 after:w-36 after:bg-gradient-radial after:from-blue-700/20 after:via-transparent after:to-transparent after:content-[''] dark:text-text md:sticky md:w-64 md:justify-between md:bg-transparent`}
    >
      <div
        className={`relative flex w-full flex-row items-center justify-between md:flex-col md:items-start ${isOpen ? "flex-col" : ""} md:gap-28 `}
      >
        <div
          className={`order-2 md:order-1 ${isOpen ? "relative" : "absolute translate-x-[75%] -rotate-90 rounded-md bg-black ring-2 ring-primary"} right-0  md:relative md:translate-x-0 md:rotate-0  md:bg-transparent md:ring-0`}
        >
          {!isOpen ? (
            <button onClick={() => setIsOpen(true)}>
              <Logo padding="p-2" text="Dashboard" Icon={FaIcons} />
            </button>
          ) : (
            <Logo text="Dashboard" Icon={FaIcons} />
          )}
        </div>
        <div className={`md:order-2 ${isOpen ? "order-2" : "order-1"}`}>
          <Nav callbackFn={() => setIsOpen(false)} />
        </div>
        {isOpen ? (
          <div
            className={`absolute right-0 top-[50%] -translate-y-[50%] translate-x-[50%] -rotate-90 md:hidden`}
          >
            <Button
              Icon={LuPanelTopClose}
              text=""
              size="text-xl"
              showIcon
              bgColor="bg-secondary"
              title="close the nav menu"
              fn={() => setIsOpen(false)}
            />
          </div>
        ) : null}
      </div>
      <div className="mb-8">
        <SingOut />
      </div>
    </aside>
  );
};

export default Sidebar;
