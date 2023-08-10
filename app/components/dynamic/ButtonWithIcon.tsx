"use client";
import Link from "next/link";
import { IconType } from "react-icons";
interface Props {
  Icon: IconType;
  fn?: (e: React.MouseEvent) => void;
  link?: string;
  size?:string;


}
const ButtonWithIcon = ({Icon, fn, link, size='2em'}: Props) => {
  return (
    <>
      {fn ? (
        <button
          className="first-letter:capitalize hover:-translate-y-1 hover:scale-105 font-bold p-2 bg-link text-interactive_text dark:text-text rounded-xl hover:bg-link_active hover:shadow-link hover:text-interactive_text  dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all 300ms"
          onClick={(e) => fn(e)}
        >
            
          <Icon size={size}/>
        </button>
      ) : link ? (
        <Link
          href={link}
          className="text-center first-letter:capitalize  hover:-translate-y-1 hover:scale-105 font-bold p-2 bg-link text-interactive_text dark:text-text rounded-xl hover:bg-link_active hover:shadow-link hover:text-interactive_text  dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all 300ms"
        >
         <Icon size={size}/>
        </Link>
      ) : (
        <><button
        className="flex justify-end first-letter:capitalize  hover:-translate-y-1 hover:scale-105 font-bold p-2 bg-link text-interactive_text dark:text-text rounded-xl hover:bg-link_active hover:shadow-link hover:text-interactive_text  dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all 300ms"
        
      >
       
        <Icon size={size}/>
      </button></>
      )}
    </>
  );
};

export default ButtonWithIcon;
