"use client";
import Link from "next/link";
import { IconType } from "react-icons";
interface Props {
  Icon?: IconType;
  text: string;
  href: string;
  fn: (e: React.MouseEvent, href: string) => void;
  textColor?: string;
  selected?: string;
  label: string;
}
const NavItem = ({
  Icon,
  label,
  text,
  href,
  textColor = "text-text_inactive",
  fn,
  selected = "",
}: Props) => {
  return (
    <Link
      onClick={(e) => fn(e, href)}
      href={href}
      aria-label={label}
      className={`${textColor} under mb-3 flex w-full items-center md:mb-1 ${href === selected ? "text-white after:opacity-100" : "after:opacity-0"}
      text-lg after:absolute after:h-5 after:w-2 after:-translate-x-8 after:rounded-smoothR  after:bg-white after:content-[''] hover:rounded-smoothR hover:text-link dark:hover:text-white
md:text-sm`}
    >
      <span className={"p-2 text-xl"}>{Icon ? <Icon /> : <></>}</span>

      <span className="p-2 capitalize">{text}</span>
    </Link>
  );
};

export default NavItem;
