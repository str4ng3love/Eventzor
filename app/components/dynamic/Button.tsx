"use client";

import Link from "next/link";
import { IconType } from "react-icons";
interface Props {
  text: string;
  fn?: (e: React.MouseEvent) => void;
  link?: string;
  bgColor?: string;
  interactive?: boolean;
  title: string;
  size?: string;
  active?: boolean;
  showIcon?: boolean;
  Icon?: IconType;
  setW?: string
  spinIcon?: boolean;
  ariaLabel?: string
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
  Icon,
  showIcon,
  setW,
  spinIcon = false,
  ariaLabel

}: Props) => {
  return (
    <>
      {fn && link ? (
        <Link aria-label={ariaLabel}
          onClick={(e) => fn(e)} href={link} className={`${bgColor} gap-2 flex items-center justify-center capitalize  ${setW} ${active ? "text-text bg-contrast dark:bg-text" : "text-contrast "} ${size} whitespace-nowrap cursor-default font-bold p-2 rounded-xl ${interactive ? "cursor-pointer hover:-translate-y-1 hover:scale-105 hover:bg-bg hover:shadow-link hover:text-text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-text_button transition-all duration-30"
            : "bg-slate-500 text-text_inactive dark:bg-slate-500 dark:text-text_inactive"
            }`}>

          {text}{Icon && active ? <Icon className={`${spinIcon ? "animate-spin" : null}`} /> : null}

        </Link>
      ) : (
        <></>
      )}
      {fn && !link ? (
        <button
          aria-label={ariaLabel}
          title={title}
          className={`${bgColor} gap-2 flex items-center justify-center capitalize ${setW}  ${active ? "dark:text-text_button text-text bg-contrast dark:bg-text" : "text-contrast dark:text-text"} ${size} whitespace-nowrap cursor-default font-bold p-2 rounded-xl ${interactive ? "cursor-pointer hover:-translate-y-1 hover:scale-105 hover:bg-bg hover:shadow-link hover:text-text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-text_button transition-all duration-300"
            : "bg-slate-500 text-text_inactive dark:bg-slate-500 dark:text-text_inactive"
            }`}
          onClick={(e) => fn(e)}
        >
          {text}{Icon && active || Icon && showIcon ? <Icon className={`${spinIcon ? "animate-spin" : null}`} /> : null}
        </button>
      ) : (
        <></>
      )}
      {link && !fn ? (
        <Link
          aria-label={ariaLabel}
          title={title}
          href={link}
          className={`${bgColor} gap-2 flex items-center justify-center capitalize ${setW}  ${active ? "dark:text-text_button text-text bg-contrast dark:bg-text" : "text-contrast dark:text-text"} ${size} whitespace-nowrap cursor-default font-bold p-2 rounded-xl ${interactive ? "cursor-pointer hover:-translate-y-1 hover:scale-105 hover:bg-bg hover:shadow-link hover:text-text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-text_button transition-all duration-30"
            : "bg-slate-500 text-text_inactive dark:bg-slate-500 dark:text-text_inactive"
            }`}
        >
          {text}{Icon && active ? <Icon className={`${spinIcon ? "animate-spin" : null}`} /> : null}
        </Link>
      ) : (
        <></>
      )}
    </>
  );
};

export default Button;