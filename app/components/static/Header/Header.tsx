import Currency from "../../dynamic/Currency";

import ShoppingCart from "../../dynamic/ShoppingCart/ShoppingCart";
import Notifications from "../../dynamic/Notifications/Notifications";
import UserMenu from "../../dynamic/UserMenu";
import Search from "../../dynamic/Header/Search";
import Link from "next/link";


const Header = () => {
  return (
    <nav className="z-10 h-[4rem] bg-bg_sidebar text-interactive_text dark:text-text dark:bg-black/50 flex justify-between items-center fixed w-full backdrop-blur-sm">
      <ul className="relative ml-8 lg:ml-32 group ">
        <li>
          <Link className="uppercase font-bold hover:text-white hover:bg-link transition-all duration-300 block p-4 w-[12ch]" href={`/`} >{`eventzor`}</Link>
        </li>
        <li className="h-0 absolute transition-all duration-500 overflow-hidden group-focus-within:h-[300%] group-focus-within:opacity-100 group-hover:h-[300%] group-hover:opacity-100 opacity-0 bg-black mt-1">
          <ul className="flex flex-col">
            <li>
              <Link className="-outline-offset-4 uppercase font-bold hover:text-white hover:bg-link transition-all duration-300 block p-4 w-[12ch]" href={`/events`} >{`events`}</Link>
            </li>
            <li>
              <Link className="-outline-offset-4 uppercase font-bold hover:text-white hover:bg-link transition-all duration-300 block p-4 w-[12ch]" href={`/market`} >{`market`}</Link>

            </li>
            <li>
              <Link className="-outline-offset-4 uppercase font-bold hover:text-white hover:bg-link transition-all duration-300 block p-4 w-[12ch]" href={`/users`} >{`users`}</Link>

            </li>
          </ul>
        </li>

      </ul>
      <div className="mr-8 lg:mr-32 flex items-center gap-4">
        <Search />
        <Notifications />

        <Currency />

        <UserMenu />
        <ShoppingCart />
      </div>
    </nav>
  );
};

export default Header;
