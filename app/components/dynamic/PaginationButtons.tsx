"use client";

import React from "react";

interface Props {
  count: number;
  limit: number;
  activePage: number;
  handleClick: (e: React.MouseEvent, page: number) => void;
}

const PaginationButtons = ({
  count,
  limit,
  activePage,
  handleClick,
}: Props) => {
  const reminder = count % limit;
  const arr = Array.from({ length: count / limit + (reminder ? 1 : 0) });
  const buttons = arr.map((b, i) => i + 1);
  return (
    <>
      {buttons
        .filter(
          (b, i) =>
            i === 0 || i === buttons.length - 1 || Math.abs(b - activePage) < 4,
        )
        .map((b, i) => (
          <button
            onClick={(e) => handleClick(e, b)}
            key={i}
            className={`${activePage === b ? "text-contrast dark:text-link" : "text-interactive"} mx-2 flex h-8 w-fit min-w-[3ch] cursor-pointer items-center justify-center rounded-md p-1 px-2 font-bold transition-all duration-200 hover:scale-110 hover:bg-link hover:text-contrast active:bg-primary dark:hover:text-text`}
          >
            {b}
          </button>
        ))}
    </>
  );
};

export default PaginationButtons;
