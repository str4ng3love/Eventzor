import Link from "next/link"
import {TbNoCopyright} from 'react-icons/tb'
const Footer = () => {


    return (
        <footer className="h-24 bg-black/50 flex items-center justify-around">
            <div className="relative flex justify-evenly items-center w-full">
                <nav>
                    <ul className="grid grid-cols-2 gap-4">
                        <li>
                            <Link className="hover:bg-link transition-all duration-300 p-1 rounded-md text-sm w-[10ch] block" href={`/`}>Eventzor</Link>
                        </li>
                        <li>
                            <Link className="hover:bg-link transition-all duration-300 p-1 rounded-md text-sm w-[10ch] block" href={`/events`}>Events</Link>
                        </li>
                        <li>
                            <Link className="hover:bg-link transition-all duration-300 p-1 rounded-md text-sm w-[10ch] block" href={`/items`}>Market</Link>
                        </li>
                        <li>
                            <Link className="hover:bg-link transition-all duration-300 p-1 rounded-md text-sm w-[10ch] block" href={`/users`}>Users</Link>
                        </li>
                    </ul>
                </nav>
                <div className="flex items-center"> 
                        <TbNoCopyright /><span>&nbsp;MP 2024</span>
                </div>

            </div>
        </footer>
    )

}

export default Footer