import Logo from "../../static/Logo"
import Nav from "./Nav"
import Notifications from "./Notifications"
import Search from "./Search"
import {FaIcons} from 'react-icons/fa'

const Sidebar = () => {
  return (
    <aside className="w-64 text-interactive_text min-h-screen flex flex-col backdrop-blur-sm items-center p-8 before:content-[''] before:absolute before:left-16 before:top-0 before:h-36 before:w-36 before:bg-gradient-radial before:from-red-600/20 before:via-transparent before:to-transparent after:content-[''] after:absolute after:left-14 after:top-2 after:h-36 after:w-36 after:bg-gradient-radial after:from-blue-700/20 after:via-transparent after:to-transparent after:-z-30 before:-z-30 dark:text-text">
        <Logo text="Dashboard" Icon={FaIcons}/>
        <div className="flex flex-col items-center pt-4 pb-8 border-b-2 border-primary text-sm ">
            <Search />
            <Notifications />
            
        </div>
        <Nav />
    </aside>
  )
}

export default Sidebar 