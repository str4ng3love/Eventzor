"use client"

import React from "react";

interface Props {
    count: number;
    limit: number;
    activePage: number;
    handleClick: (e: React.MouseEvent, page: number) => void;
}

const PaginationButtons = ({ count, limit, activePage, handleClick }: Props) => {
    const reminder = count % limit
    const arr = Array.from({ length: count / limit + (reminder ? 1 : 0) })
    const buttons = arr.map((b, i) => i + 1)
    return (<>
        
        {buttons.filter((b, i) => i === 0 || i === buttons.length - 1 || Math.abs(b - activePage ) < 4 ).map((b, i) =>
            <div onClick={(e) => handleClick(e, b)} key={i} className={`${activePage === b ? "text-link" : "text-gray-400"} min-w-[3ch] flex items-center justify-center rounded-md mx-2 h-8 w-fit p-1 px-2 hover:bg-link hover:text-text font-bold transition-all duration-200 cursor-pointer active:bg-primary hover:scale-110`}>
                {b}
            </div>
        )}
    </>
    )
}

export default PaginationButtons