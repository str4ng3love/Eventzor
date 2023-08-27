import HeaderNav from "../../dynamic/Header/HeaderNav";

const Header = () => {
  return (
    <nav className="h-[4rem] bg-bg_sidebar dark:bg-black z-50 flex justify-between items-center static">

        <div className="ml-32">
          <HeaderNav dest="/" text="home" />
          <HeaderNav dest="/events" text="events" />
          <HeaderNav dest="/orders" text="orders" />
        </div>
        <div className="mr-32">
          <HeaderNav dest="/dashboard" text="dashboard" />
        </div>

    </nav>
  );
};

export default Header;
