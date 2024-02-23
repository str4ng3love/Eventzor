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
  setW?: string;
  spinIcon?: boolean;
  ariaLabel?: string;
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
  ariaLabel,
}: Props) => {
  return (
    <>
      {fn && link ? (
        <Link
          aria-label={ariaLabel}
          onClick={(e) => fn(e)}
          href={link}
          className={`${bgColor} flex items-center justify-center gap-2 capitalize  ${setW} ${active ? "bg-contrast text-text dark:bg-text dark:text-text_button" : "text-contrast dark:text-text"} ${size} cursor-default whitespace-nowrap rounded-xl p-2 font-bold ${
            interactive
              ? "duration-30 cursor-pointer transition-all hover:-translate-y-1 hover:scale-105 hover:bg-bg hover:text-text hover:shadow-link dark:hover:bg-text dark:hover:text-text_button dark:hover:shadow-link"
              : "text-text_inactive dark:text-text_inactive bg-slate-500 dark:bg-slate-500"
          }`}
        >
          {text}
          {Icon && active ? (
            <Icon className={`${spinIcon ? "animate-spin" : null}`} />
          ) : null}
        </Link>
      ) : (
        <></>
      )}
      {fn && !link ? (
        <button
          aria-label={ariaLabel}
          title={title}
          className={`${bgColor} flex items-center justify-center gap-2 capitalize ${setW}  ${active ? "bg-contrast text-text dark:bg-text dark:text-text_button" : "text-contrast dark:text-text"} ${size} cursor-default whitespace-nowrap rounded-xl p-2 font-bold ${
            interactive
              ? "cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-bg hover:text-text hover:shadow-link dark:hover:bg-text dark:hover:text-text_button dark:hover:shadow-link"
              : "text-text_inactive dark:text-text_inactive bg-slate-500 dark:bg-slate-500"
          }`}
          onClick={(e) => fn(e)}
        >
          {text}
          {(Icon && active) || (Icon && showIcon) ? (
            <Icon className={`${spinIcon ? "animate-spin" : null}`} />
          ) : null}
        </button>
      ) : (
        <></>
      )}
      {link && !fn ? (
        <Link
          aria-label={ariaLabel}
          title={title}
          href={link}
          className={`${bgColor} flex items-center justify-center gap-2 capitalize ${setW}  ${active ? "bg-contrast text-text dark:bg-text dark:text-text_button" : "text-contrast dark:text-text"} ${size} cursor-default whitespace-nowrap rounded-xl p-2 font-bold ${
            interactive
              ? "duration-30 cursor-pointer transition-all hover:-translate-y-1 hover:scale-105 hover:bg-bg hover:text-text hover:shadow-link dark:hover:bg-text dark:hover:text-text_button dark:hover:shadow-link"
              : "text-text_inactive dark:text-text_inactive bg-slate-500 dark:bg-slate-500"
          }`}
        >
          {text}
          {Icon && active ? (
            <Icon className={`${spinIcon ? "animate-spin" : null}`} />
          ) : null}
        </Link>
      ) : (
        <></>
      )}
    </>
  );
};

export default Button;
