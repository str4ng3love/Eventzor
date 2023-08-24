import Logo from "../Logo";
import Nav from "../../dynamic/Sidebar/Nav";
import Notifications from "../../dynamic/Sidebar/Notifications";
import Search from "../../dynamic/Search";
import { FaIcons } from "react-icons/fa";
import SingOut from "../../dynamic/Sidebar/SingOut";


const Sidebar = () => {
  return (
    <aside className="h-[calc(100dvh_-_4rem)] w-64 text-interactive_text flex flex-col justify-between backdrop-blur-sm items-center p-8 before:content-[''] before:absolute before:left-16 before:top-0 before:h-36 before:w-36 before:bg-gradient-radial before:from-red-600/20 before:via-transparent before:to-transparent after:content-[''] after:absolute after:left-14 after:top-2 after:h-36 after:w-36 after:bg-gradient-radial after:from-blue-700/20 after:via-transparent after:to-transparent after:-z-30 before:-z-30 dark:text-text">
      <div>
       
        <Logo text="Dashboard" Icon={FaIcons} />
        <div className="flex flex-col items-center pt-4 pb-8 border-b-2 border-primary text-sm ">
          <Search />
          <Notifications />
        </div>
        <Nav />
      </div>
      <div className="mb-8">
        <SingOut />
      </div>
    </aside>
  );
};

export default Sidebar;
