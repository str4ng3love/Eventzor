"use client";

import Link from "next/link";
import { IconType, icons } from "react-icons";
interface Props {
  text: string;
  fn?: (e: React.MouseEvent) => void;
  link?: string;
  bgColor?: string;
  interactive?: boolean;
  title: string;
  size?: string;
  active?: boolean;
  Icon?: IconType
}
const Button = ({
  fn,
  text,
  link,
  bgColor = "bg-link",
  interactive = true,
  title,
  size = "text-base",
  active = false,
  Icon

}: Props) => {
  return (
    <>
      {fn && link ? (
        <Link href={link}>
          <button
            title={title}
            className={`${bgColor} gap-2 flex items-center justify-center capitalize   ${active ? "dark:text-interactive_text text-text bg-text" : "text-interactive_text dark:text-text"} ${size} whitespace-nowrap cursor-default min-w-[11ch] font-bold p-2 rounded-xl ${interactive ? "cursor-pointer hover:-translate-y-1 hover:scale-105 hover:bg-link_active hover:shadow-link hover:text-interactive_text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all duration-30"
                : ""
              }`}
            onClick={(e) => fn(e)}
          >
            {text}{Icon && active? <Icon /> : null}
          </button>
        </Link>
      ) : (
        <></>
      )}
      {fn && !link ? (
        <button
          title={title}
          className={`${bgColor} gap-2 flex items-center justify-center capitalize   ${active ? "dark:text-interactive_text text-text bg-text" : "text-interactive_text dark:text-text"} ${size} whitespace-nowrap cursor-default min-w-[11ch] font-bold p-2 rounded-xl ${interactive ? "cursor-pointer hover:-translate-y-1 hover:scale-105 hover:bg-link_active hover:shadow-link hover:text-interactive_text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all duration-300"
          : ""
        }`}
          onClick={(e) => fn(e)}
        >
          {text}{Icon && active? <Icon  /> : null}
        </button>
      ) : (
        <></>
      )}
      {link && !fn ? (
        <Link
          title={title}
          href={link}
          className={`${bgColor} gap-2 flex items-center justify-center capitalize   ${active ? "dark:text-interactive_text text-text bg-text" : "text-interactive_text dark:text-text"} ${size} whitespace-nowrap cursor-default min-w-[11ch] font-bold p-2 rounded-xl ${interactive ? "cursor-pointer hover:-translate-y-1 hover:scale-105 hover:bg-link_active hover:shadow-link hover:text-interactive_text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all duration-30"
          : ""
        }`}
        >
          {text}{Icon && active? <Icon /> : null}
        </Link>
      ) : (
        <></>
      )}
    </>
  );
};

export default Button;
// {fn ? (
//   <button
//   title={title}
//     className={`${size} whitespace-nowrap cursor-default first-letter:capitalize min-w-[11ch] font-bold p-2 ${bgColor} text-interactive_text dark:text-text rounded-xl ${interactive ? "cursor-pointer hover:-translate-y-1 hover:scale-105 hover:bg-link_active hover:shadow-link hover:text-interactive_text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all duration-300": ""}`}
//     onClick={(e) => fn(e)}
//   >
//     {text}
//   </button>
// ) : link ? (
//   <Link
//   title={title}
//     href={link}
//     className={`${size} whitespace-nowrap text-center first-letter:capitalize min-w-[11ch] font-bold p-2 ${bgColor} text-interactive_text dark:text-text rounded-xl ${interactive ? "cursor-pointer hover:-translate-y-1 hover:scale-105 hover:bg-link_active hover:shadow-link hover:text-interactive_text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all duration-300": ""}`}
//   >
//     {text}
//   </Link>
// ) : (
//   <></>
// )}
