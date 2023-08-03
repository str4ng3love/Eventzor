"use client";
import Icon from "../Icon";
import { FaHouseUser, FaCog, } from "react-icons/fa";
import {BsCalendar3EventFill, } from "react-icons/bs"
import {TbFileSpreadsheet} from "react-icons/tb"
import Link from "next/link";
const Nav = () => {
  return (
    <nav className="flex flex-col items-center justify-start w-full py-8 hover:text-white text-sm">
      <Link href={"/dashboard"} className="w-full p-1 mb-1">
        <div className="flex items-center">
          <Icon Icon={FaHouseUser} textColor="text-text_interactive" />
          <span>Home</span>
        </div>
      </Link>
      <Link href={"/events"} className="w-full p-1 mb-1">
        <div className="flex items-center">
          <Icon Icon={BsCalendar3EventFill} textColor="text-text_interactive" />
          <span>Events</span>
        </div>
      </Link>
      <Link href={"/orders"} className="w-full p-1 mb-1">
        <div className="flex items-center">
          <Icon Icon={TbFileSpreadsheet} textColor="text-text_interactive" />
          <span>Orders</span>
        </div>
      </Link>
      <Link href={"/settings"} className="w-full p-1 mb-1">
        <div className="flex items-center">
          <Icon Icon={FaCog} textColor="text-text_interactive" />
          <span>Settings</span>
        </div>
      </Link>

    </nav>
  );
};

export default Nav;
