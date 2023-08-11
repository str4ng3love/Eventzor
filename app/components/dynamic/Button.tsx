"use client";
import Link from "next/link";
interface Props {
  text: string;
  fn?: (e: React.MouseEvent) => void;
  link?: string;
  bgColor?: string;

}
const Button = ({ fn, text, link, bgColor="bg-link"}: Props) => {
  return (
    <>
      {fn ? (
        <button
          className={`first-letter:capitalize min-w-[10ch] hover:-translate-y-1 hover:scale-105 font-bold p-2 ${bgColor} text-interactive_text dark:text-text rounded-xl hover:bg-link_active hover:shadow-link hover:text-interactive_text  dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all 300ms`}
          onClick={(e) => fn(e)}
        >
          {text}
        </button>
      ) : link ? (
        <Link
          href={link}
          className={`text-center first-letter:capitalize min-w-[10ch] hover:-translate-y-1 hover:scale-105 font-bold p-2 ${bgColor} text-interactive_text dark:text-text rounded-xl hover:bg-link_active hover:shadow-link hover:text-interactive_text  dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all 300ms`}
        >
          {text}
        </Link>
      ) : (
        <></>
      )}
    </>
  );
};

export default Button;
