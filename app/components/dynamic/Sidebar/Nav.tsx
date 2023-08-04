"use client";
import { FaHouseUser, FaCog } from "react-icons/fa";
import { BsCalendar3EventFill } from "react-icons/bs";
import { TbFileSpreadsheet } from "react-icons/tb";

import { useEffect, useState } from "react";
import NavItem from "./NavItem";

const Nav = () => {
  const [selected, setSelected] = useState('home');

  return (
    <nav className="flex flex-col items-center justify-start w-full py-8">
      <NavItem
        text="home"
        Icon={FaHouseUser}
        href="/dashboard"
        fn={(e, text) =>{setSelected(text)}}
        selected={selected}
        label="navigate to dashboard"
      />
      <NavItem
        text="events"
        Icon={BsCalendar3EventFill}
        href="/dashboard/events"
        fn={(e, text) =>{setSelected(text)}}
        selected={selected}
        label="navigate to events page"
      />
      <NavItem
        text="orders"
        Icon={TbFileSpreadsheet}
        href="/dashboard/orders"
        fn={(e, text) =>{setSelected(text)}}
        selected={selected}
        label="navigate to orders page"
      />
      <NavItem
        text="settings"
        Icon={FaCog}
        href="/dashboard/settings"
        fn={(e, text) =>{setSelected(text)}}
        selected={selected}
        label="navigate to settings page"
      />
    </nav>
  );
};

export default Nav;
