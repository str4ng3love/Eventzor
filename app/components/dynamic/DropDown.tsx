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

const DropDown = ({ items, title, fn, bgColor = "bg-link", size='text-base' }: Props) => {
  return (
    <div className="">
      <Menu>
        <Menu.Button
          className={`text-contrast dark:text-text hover:text-text dark:hover:text-text_button  first-letter:capitalize min-w-[10ch] hover:-translate-y-1 hover:scale-105 font-bold p-2 ${size} ${bgColor} dark:text-text rounded-xl hover:bg-bg hover:shadow-link hover:text-interactive_text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all duration-300`}
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
            className={`z-50 absolute flex mt-1 flex-col origin-top-right w-56 shadow-bg_sidebar shadow-lg rounded-md focus:outline-none dark:ring-2 dark:ring-primary `}
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
                        ? "bg-link text-contrast dark:text-text p-2"
                        : "text-text bg-bg p-2 dark:text-text"
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
