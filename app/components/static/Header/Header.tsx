import Currency from "../../dynamic/Currency";
import HeaderNav from "../../dynamic/Header/HeaderNav";
import ShoppingCart from "../../dynamic/ShoppingCart/ShoppingCart";
import User from "../../dynamic/User";

const Header = () => {
  return (
    <nav className=" h-[4rem] bg-bg_sidebar text-interactive_text dark:text-text dark:bg-black z-50 flex justify-between items-center static">
      <div className="ml-32">
        <HeaderNav dest="/" text="home" />
        <HeaderNav dest="/events" text="events" />
        <HeaderNav dest="/market" text="market" />
      </div>
      <div className="mr-32 flex items-center gap-4">
        <User />
        <span className="lg:block hidden ">
          <Currency />
        </span>
        <ShoppingCart />
      </div>
    </nav>
  );
};

export default Header;
