"use client";
import Link from "next/link";
import { IconType } from "react-icons";
interface Props {
  Icon: IconType;
  fn?: (e: React.MouseEvent) => void;
  link?: string;
  size?: string;
  bgColor?: string;
  title?: string;
  text?: string;
  ariaLabel?: string;
}
const ButtonWithIcon = ({
  title = "",
  Icon,
  fn,
  link,
  size = "2em",
  bgColor = "bg-link",
  text = "",
  ariaLabel,
}: Props) => {
  return (
    <>
      {fn ? (
        <button
          aria-label={ariaLabel}
          title={title}
          className={`relative flex h-fit w-fit cursor-pointer items-center gap-1 rounded-xl p-2 font-bold text-text transition-all duration-300 first-letter:capitalize hover:-translate-y-1 hover:scale-105 hover:bg-link_active hover:text-contrast dark:text-text dark:hover:bg-text dark:hover:text-contrast dark:hover:shadow-link ${bgColor} `}
          onClick={(e) => fn(e)}
        >
          <Icon size={size} />
          {text ? text : ""}
        </button>
      ) : link ? (
        <Link
          aria-label={ariaLabel}
          href={link}
          className={`relative flex h-fit w-fit cursor-pointer items-center gap-1 rounded-xl p-2 font-bold text-contrast transition-all duration-300 first-letter:capitalize hover:-translate-y-1 hover:scale-105 hover:bg-link_active hover:text-contrast dark:text-text dark:hover:bg-text dark:hover:text-contrast dark:hover:shadow-link ${bgColor}`}
        >
          <Icon size={size} />
          {text ? text : ""}
        </Link>
      ) : (
        <>
          <button
            aria-label={ariaLabel}
            title={title}
            className={`flex h-fit w-fit cursor-pointer items-center gap-1 rounded-xl p-2 font-bold text-contrast transition-all duration-300 first-letter:capitalize hover:-translate-y-1 hover:scale-105 hover:bg-link_active hover:text-contrast dark:text-text dark:hover:bg-text dark:hover:text-contrast dark:hover:shadow-link ${bgColor}`}
          >
            <Icon size={size} />
            {text ? text : ""}
          </button>
        </>
      )}
    </>
  );
};

export default ButtonWithIcon;
