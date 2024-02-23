import Link from "next/link";
import { TbNoCopyright } from "react-icons/tb";
const Footer = () => {
  return (
    <footer className="flex h-36 items-center justify-around bg-interactive pb-6 dark:bg-black">
      <div className="relative flex w-full flex-col items-center justify-evenly gap-2 sm:flex-row">
        <nav>
          <ul className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:gap-4">
            <li>
              <Link
                className="block w-[10ch] rounded-md p-1 text-center text-sm transition-all duration-300 hover:bg-link"
                href={`/`}
              >
                Eventzor
              </Link>
            </li>
            <li>
              <Link
                className="block w-[10ch] rounded-md p-1 text-center text-sm transition-all duration-300 hover:bg-link"
                href={`/events`}
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                className="block w-[10ch] rounded-md p-1 text-center text-sm transition-all duration-300 hover:bg-link"
                href={`/market`}
              >
                Market
              </Link>
            </li>
            <li>
              <Link
                className="block w-[10ch] rounded-md p-1 text-center text-sm transition-all duration-300 hover:bg-link"
                href={`/users`}
              >
                Users
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center whitespace-nowrap text-sm ">
          <TbNoCopyright />
          <span>&nbsp;EVENTZOR 2024</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
