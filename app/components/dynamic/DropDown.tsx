"use client";

import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

interface Props {
  fn: (e: React.MouseEvent) => void;
  size?: string;
  title?: string;
  items: string[];
  bgColor?: string;
}

const DropDown = ({
  items,
  title,
  fn,
  bgColor = "bg-link",
  size = "text-base",
}: Props) => {
  return (
    <div className="">
      <Menu>
        <Menu.Button
          className={`min-w-[10ch] p-2 font-bold text-contrast  first-letter:capitalize hover:-translate-y-1 hover:scale-105 hover:text-text dark:text-text dark:hover:text-text_button ${size} ${bgColor} hover:text-interactive_text dark:hover:text-interactive_text rounded-xl transition-all duration-300 hover:bg-bg hover:shadow-link dark:text-text dark:hover:bg-text dark:hover:shadow-link`}
        >
          <>{title}</>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items
            className={`shadow-bg_sidebar absolute z-50 mt-1 flex w-56 origin-top-right flex-col rounded-md shadow-lg focus:outline-none dark:ring-2 dark:ring-primary `}
          >
            {items.map((item, i) => (
              <Menu.Item key={i}>
                {({ active }) => (
                  <span
                    onClick={(e) => {
                      fn(e);
                    }}
                    className={`${
                      active
                        ? "bg-link p-2 text-contrast dark:text-text"
                        : "bg-bg p-2 text-text dark:text-text"
                    } first-letter:uppercase`}
                  >
                    {item}
                  </span>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default DropDown;
