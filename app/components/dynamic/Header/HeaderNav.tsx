'use client'

import Link from "next/link";

interface Props {
    text:string;
    dest: string;
}
const HeaderNav = ({dest, text}: Props) => {
  return (
   
    <Link className="uppercase p-4 mx-1 rounded-md font-bold hover:text-white hover:bg-link transition-all 300ms" href={dest} >{text}</Link>

  )
}

export default HeaderNav