import Currency from "../../dynamic/Currency";
import HeaderNav from "../../dynamic/Header/HeaderNav";
import ShoppingCart from "../../dynamic/ShoppingCart/ShoppingCart";
import Notifications from "../../dynamic/Notifications/Notifications";
import UserMenu from "../../dynamic/UserMenu";


const Header = () => {
  return (
    <nav className="h-[4rem] bg-bg_sidebar text-interactive_text dark:text-text z-20 dark:bg-black/50 flex justify-between items-center fixed w-full backdrop-blur-sm">
      <div className="ml-8 lg:ml-32">
        <HeaderNav dest="/" text="home" />
        <HeaderNav dest="/events" text="events" />
        <HeaderNav dest="/market" text="market" />
      </div>
      <div className="mr-8 lg:mr-32 flex items-center gap-4">
        <Notifications />
        <span className="lg:block hidden ">
          <Currency />
        </span>
        <UserMenu />
        <ShoppingCart />
      </div>
    </nav>
  );
};

export default Header;
