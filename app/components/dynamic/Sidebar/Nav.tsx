"use client";
import { FaHouseUser, FaCog} from "react-icons/fa";
import { BsCalendar3EventFill } from "react-icons/bs";
import { TbFileSpreadsheet } from "react-icons/tb";
import { usePathname } from 'next/navigation'

import { useEffect, useState } from "react";
import NavItem from "./NavItem";
import { BiMoney } from "react-icons/bi";

const Nav = () => {
  const [selected, setSelected] = useState('home');
  const currentPath = usePathname()
  useEffect(()=>{
    setSelected(currentPath)
  }, [currentPath])
  return (
    <nav className="flex flex-col items-center justify-start w-full py-8">
      <NavItem
        text="home"
        Icon={FaHouseUser}
        href="/dashboard"
        fn={(e, href) =>{setSelected(href)}}
        selected={selected}
        label="navigate to dashboard"
      />
      <NavItem
        text="my events"
        Icon={BsCalendar3EventFill}
        href="/dashboard/events"
        fn={(e, href) =>{setSelected(href)}}
        selected={selected}
        label="navigate to events page"
      />
           <NavItem
        text="my market"
        Icon={BiMoney}
        href="/dashboard/market"
        fn={(e, href) =>{setSelected(href)}}
        selected={selected}
        label="navigate to market page"
      />
      <NavItem
        text="my orders"
        Icon={TbFileSpreadsheet}
        href="/dashboard/orders"
        fn={(e, href) =>{setSelected(href)}}
        selected={selected}
        label="navigate to orders page"
      />
      <NavItem
        text="settings"
        Icon={FaCog}
        href="/dashboard/settings"
        fn={(e, href) =>{setSelected(href)}}
        selected={selected}
        label="navigate to settings page"
      />
    </nav>
  );
};

export default Nav;
