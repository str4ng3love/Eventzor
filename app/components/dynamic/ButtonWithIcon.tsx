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
  text?:string;
}
const ButtonWithIcon = ({
  title = "",
  Icon,
  fn,
  link,
  size = "2em",
  bgColor = "bg-link",
  text=""
}: Props) => {
  return (
    <>
      {fn ? (
        <button
          title={title}
          className={`flex items-center gap-1 cursor-pointer relative first-letter:capitalize hover:-translate-y-1  hover:scale-105 font-bold p-2 text-interactive_text dark:text-text rounded-xl hover:bg-link_active hover:shadow-link hover:text-interactive_text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all duration-300 ${bgColor} `}
          onClick={(e) => fn(e)}
        >
          <Icon size={size} />{text? text:""}
        </button>
      ) : link ? (
        <Link
          href={link}
          className={`flex items-center gap-1 cursor-pointer relative first-letter:capitalize hover:-translate-y-1 hover:scale-105 font-bold p-2 text-interactive_text dark:text-text rounded-xl hover:bg-link_active hover:shadow-link hover:text-interactive_text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all duration-300 ${bgColor}`}
        >
          <Icon size={size} />{text? text:""}
        </Link>
      ) : (
        <>
          <button
            title={title}
            className={`flex items-center gap-1 cursor-pointer first-letter:capitalize hover:-translate-y-1 hover:scale-105 font-bold p-2 text-interactive_text dark:text-text rounded-xl hover:bg-link_active hover:shadow-link hover:text-interactive_text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all duration-300 ${bgColor}`}
          >
            <Icon size={size} />{text? text:""}
          </button>
        </>
      )}
    </>
  );
};

export default ButtonWithIcon;
