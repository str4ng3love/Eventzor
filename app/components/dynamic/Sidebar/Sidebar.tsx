'use client'
import Logo from "../../static/Logo";
import Nav from "./Nav";


import { FaIcons } from "react-icons/fa";
import SingOut from "./SingOut";
import { useState } from "react";
import Button from "../Button";
import { LuPanelTopClose } from "react-icons/lu";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <aside className={`md:translate-x-0  ${isOpen ? "translate-x-0 flex-col" : "-translate-x-[100%]"} fixed md:sticky  md:bg-transparent md:justify-between w-full bg-black top-[4rem] h-[calc(100dvh_-_4rem)] z-10 md:w-64 text-interactive_text flex flex-col justify-evenly  mr-1 items-center p-8 before:content-[''] before:absolute before:left-16 before:top-0 before:h-36 before:w-36 before:bg-gradient-radial before:from-red-600/20 before:via-transparent before:to-transparent after:content-[''] after:absolute after:left-14 after:top-2 after:h-36 after:w-36 after:bg-gradient-radial after:from-blue-700/20 after:via-transparent after:to-transparent after:-z-10 before:-z-10 dark:text-text transition-all duration-300`}>
      <div className={`w-full flex md:flex-col flex-row justify-between md:items-start items-center relative ${isOpen ? "flex-col" : ""} md:gap-28 `}>
        <div className={`order-2 md:order-1 ${isOpen ? "relative" : "absolute -rotate-90 translate-x-[75%] bg-black rounded-md ring-2 ring-primary"} md:rotate-0  md:relative right-0 md:translate-x-0  md:bg-transparent md:ring-0`}>
          {!isOpen ? <button onClick={() => setIsOpen(true)}>
            <Logo padding="p-2" text="Dashboard" Icon={FaIcons} />
          </button> : <Logo text="Dashboard" Icon={FaIcons} />}
        </div>
        <div className={`md:order-2 ${isOpen ? "order-2" : "order-1"}`}>
          <Nav callbackFn={() => setIsOpen(false)} />
        </div>
        {isOpen ?
          <div className={`absolute md:hidden right-0 -rotate-90 top-[50%] -translate-y-[50%] translate-x-[50%]`}>
            <Button Icon={LuPanelTopClose} text="" size="text-xl" showIcon bgColor="bg-secondary" title="close the nav menu" fn={() => setIsOpen(false)} />
          </div> : null}
      </div>
      <div className="mb-8">
        <SingOut />
      </div>
    </aside>
  );
};

export default Sidebar;
