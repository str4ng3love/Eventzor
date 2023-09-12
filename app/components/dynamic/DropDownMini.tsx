"use client";

import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { IconType } from "react-icons";

interface Props {
  Icon: IconType;
  size?: string;
  items: { text: string; fn: (e: React.MouseEvent) => void }[];
  bgColor?: string;
}

const DropDownMini = ({
  items,
  Icon,
  size = "2em",
  bgColor = " bg-link",
}: Props) => {
  return (
    <div className="flex min-h-[4rem] relative items-center justify-center ">
      {/* Prop `id` did not match. Server: "headlessui-menu-button-:R6crb9mcq:" Client: "headlessui-menu-button-:Rpjdd6pj9:"  || Next.js Error as of 10.08.23, should be fixed in upcoming release.||Resolved */}
      <Menu>
        <Menu.Button
          className={` hover:-translate-y-1 hover:scale-105 font-bold p-2 ${bgColor} text-interactive_text dark:text-text rounded-xl hover:bg-link_active hover:shadow-link hover:text-interactive_text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all duration-300`}
        >
          <Icon size={size} />
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
            className={`z-50 absolute flex flex-col origin-top-right w-[10ch] bg-white shadow-bg_sidebar shadow-lg rounded-md focus:outline-none `}
          >
            {items ? (
              items.map((item, i) => (
                <Menu.Item key={i}>
                  {({ active }) => (
                    <span
                      onClick={(e) => {
                        item.fn(e);
                      }}
                      className={`${
                        active
                          ? "bg-text text-interactive_text p-2"
                          : "text-interactive_text bg-link p-2 dark:text-text"
                      } first-letter:uppercase`}
                    >
                      {item.text}
                    </span>
                  )}
                </Menu.Item>
              ))
            ) : (
              <></>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default DropDownMini;
