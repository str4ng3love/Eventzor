import Link from "next/link"
import {TbNoCopyright} from 'react-icons/tb'
const Footer = () => {


    return (
        <footer className="h-24 bg-black/50 flex items-center justify-around">
            <div className="relative flex justify-evenly items-center w-full flex-col sm:flex-row gap-2">
                <nav>
                    <ul className="grid sm:grid-cols-4 lg:gap-4 gap-1 grid-cols-2">
                        <li>
                            <Link className="hover:bg-link transition-all duration-300 p-1 rounded-md text-sm w-[10ch] block text-center" href={`/`}>Eventzor</Link>
                        </li>
                        <li>
                            <Link className="hover:bg-link transition-all duration-300 p-1 rounded-md text-sm w-[10ch] block text-center" href={`/events`}>Events</Link>
                        </li>
                        <li>
                            <Link className="hover:bg-link transition-all duration-300 p-1 rounded-md text-sm w-[10ch] block text-center" href={`/items`}>Market</Link>
                        </li>
                        <li>
                            <Link className="hover:bg-link transition-all duration-300 p-1 rounded-md text-sm w-[10ch] block text-center" href={`/users`}>Users</Link>
                        </li>
                    </ul>
                </nav>
                <div className="flex items-center text-sm whitespace-nowrap "> 
                        <TbNoCopyright /><span>&nbsp;EVENTZOR 2024</span>
                </div>

            </div>
        </footer>
    )

}

export default Footer