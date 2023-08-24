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
  label:string;
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
      className={`${textColor} w-full mb-1 flex items-center under ${href === selected ? "after:opacity-100 text-white" : "after:opacity-0" }
      after:bg-white after:h-5 after:rounded-smoothR hover:text-white text-sm after:absolute after:content-[''] after:w-2 hover:rounded-smoothR
after:-translate-x-8`}
    >
      <span className={"text-xl p-2"}>
        {Icon? <Icon />: <></>}
      </span>

      <span className="first-letter:uppercase p-2">{text}</span>
    </Link>
  );
};

export default NavItem;
