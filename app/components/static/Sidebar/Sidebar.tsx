'use client'
import Logo from "../Logo";
import Nav from "../../dynamic/Sidebar/Nav";


import { FaArrowLeft, FaIcons} from "react-icons/fa";
import SingOut from "../../dynamic/Sidebar/SingOut";
import { useState } from "react";
import Button from "../../dynamic/Button";

import { BsArrow90DegLeft } from "react-icons/bs";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <aside className={`md:translate-x-0  ${isOpen ? "translate-x-0 flex-col" : "-translate-x-[100%]"} fixed md:sticky md:backdrop-blur-sm md:bg-transparent md:justify-between w-full bg-black top-[4rem] h-[calc(100dvh_-_4rem)] z-10 md:w-64 text-interactive_text flex flex-col justify-evenly  mr-1 items-center p-8 before:content-[''] before:absolute before:left-16 before:top-0 before:h-36 before:w-36 before:bg-gradient-radial before:from-red-600/20 before:via-transparent before:to-transparent after:content-[''] after:absolute after:left-14 after:top-2 after:h-36 after:w-36 after:bg-gradient-radial after:from-blue-700/20 after:via-transparent after:to-transparent after:-z-30 before:-z-30 dark:text-text transition-all duration-300`}>
      <div className={` w-full flex md:flex-col flex-row justify-between md:items-start items-center relative ${isOpen ? "flex-col" : ""}`}>
        <div className={`order-2 md:order-1 ${isOpen ? "relative" : "absolute -rotate-90 translate-x-[75%] bg-black rounded-md ring-2 ring-primary"} md:rotate-0  md:relative right-0 md:translate-x-0  md:bg-transparent md:ring-0`}>
          <button onClick={() => setIsOpen(true)}>
            <Logo text="Dashboard" Icon={FaIcons} />
          </button>
        </div>
        <div className={`md:order-2 ${isOpen ? "order-2" : "order-1"}`}>
          <Nav />
        </div>
        <Button Icon={FaArrowLeft} text="" showIcon bgColor="bg-secondary"  title="close the nav menu" fn={() => setIsOpen(false)} />
      </div>
      <div className="mb-8">
        <SingOut />
      </div>
    </aside>
  );
};

export default Sidebar;
