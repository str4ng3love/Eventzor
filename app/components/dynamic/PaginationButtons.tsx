"use client"

import React from "react";

interface Props {
    count: number;
    limit: number;
    activePage?:number;
    handleClick: (e:React.MouseEvent, page:number)=>void;
}

const PaginationButtons = ({count, limit, activePage, handleClick }: Props) => {
    const reminder = count % limit
    const buttons = Array.from({ length: count / limit + (reminder ? 1 : 0) })
    return (<>
        {buttons.map((b, i) => 
        <div onClick={(e)=>handleClick(e, i+1)} key={i} className={`${activePage === i+1 ? "text-link": "text-gray-400"} min-w-[3ch] flex items-center justify-center rounded-md mx-2 h-8 w-fit p-1 px-2 hover:bg-link hover:text-text font-bold transition-all duration-200 cursor-pointer active:bg-primary active:scale-110`}>
            {i+1}
        </div>)}
    </>
    )
}

export default PaginationButtons