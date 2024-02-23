import Currency from "../../dynamic/Currency";

import ShoppingCart from "../../dynamic/ShoppingCart/ShoppingCart";
import Notifications from "../../dynamic/Notifications/Notifications";
import UserMenu from "../../dynamic/UserMenu";
import Search from "../../dynamic/Header/Search";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import BurgerMenu from "../../dynamic/Header/BurgerMenu";
import DropDownNav from "../../dynamic/DropDownNav";

const Header = async () => {
  const session = await getServerSession(options);

  return (
    <header className="relative">
      <nav className="fixed z-50 flex h-[4rem] w-full items-center justify-between bg-black/50 px-10 text-contrast backdrop-blur-sm dark:text-text">
        <DropDownNav
          buttonTitle="Eventzor"
          items={[
            { href: "/", label: "home" },
            { href: "/events", label: "events" },
            { href: "/market", label: "market" },
            { href: "/users", label: "users" },
            { href: "/dashboard", label: "dashboard" },
          ]}
        />

        <div className="hidden items-center gap-4 pr-8 md:flex">
          <Search minimizeOnLg />
          <Currency />
          <UserMenu />
        </div>
        <div className="mr-8 flex gap-4">
          <ShoppingCart />
          <BurgerMenu />
          {session?.user?.name ? <Notifications /> : <></>}
        </div>
      </nav>
    </header>
  );
};

export default Header;
