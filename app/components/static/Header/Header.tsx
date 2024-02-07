import Currency from "../../dynamic/Currency";

import ShoppingCart from "../../dynamic/ShoppingCart/ShoppingCart";
import Notifications from "../../dynamic/Notifications/Notifications";
import UserMenu from "../../dynamic/UserMenu";
import Search from "../../dynamic/Header/Search";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import BurgerMenu from "../../dynamic/Header/BurgerMenu";
import DropDownNav from "../../dynamic/DropDownNav";


const Header = async () => {
  const session = await getServerSession(options)

  return (
    <header className="relative">
      <nav className="px-10 z-10 h-[4rem] bg-bg_sidebar text-interactive_text dark:text-text dark:bg-black/50 flex justify-between items-center fixed w-full backdrop-blur-sm">

        <DropDownNav buttonTitle="Eventzor" items={[{href:"/", label:"home"}, {href:"/events", label:"events"}, {href:"/market", label:"market"}, {href:"/users", label:"users"}]} />


        <div className="gap-4 items-center pr-8 md:flex hidden">
          <Search minimizeOnLg />
          <Currency />
          <UserMenu />
          <ShoppingCart />
        </div>
        <div className="flex mr-8 gap-4">
          <BurgerMenu />
          {session?.user?.name ? < Notifications /> : <></>}
        </div>

      </nav>
    </header>
  );
};

export default Header;
