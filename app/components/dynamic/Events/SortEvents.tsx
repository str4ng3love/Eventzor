"use client";

import { Menu, Transition } from "@headlessui/react";
import { Event } from "@prisma/client";
import React, { useState, Fragment } from "react";

interface Props {
  events?: Event[];
  fn: (e: React.MouseEvent) => void;
}

const SortEvents = ({ events, fn }: Props) => {
  return (
    <div>
      {/* Prop `id` did not match. Server: "headlessui-menu-button-:R6crb9mcq:" Client: "headlessui-menu-button-:Rpjdd6pj9:"  || Next.js Error as of 10.08.23, should be fixed in upcoming release.||Resolved */}
      <Menu>
        <Menu.Button
          className={`first-letter:capitalize min-w-[10ch] hover:-translate-y-1 hover:scale-105 font-bold p-2 bg-link text-interactive_text dark:text-text rounded-xl hover:bg-link_active hover:shadow-link hover:text-interactive_text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all 300ms`}
        >
          Sort By
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
            className={`absolute flex flex-col mt-2 w-56 origin-top-right bg-white shadow-bg_sidebar shadow-lg rounded-md focus:outline-none `}
          >
            <Menu.Item>
              {({ active }) => (
                <span
                  onClick={(e) => {
                    fn(e);
                  }}
                  className={`${
                    active
                      ? "bg-text text-interactive_text p-2"
                      : "text-interactive_text bg-link p-2 dark:text-text"
                  }`}
                >
                  Date
                </span>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <span
                  onClick={(e) => {
                    fn(e);
                  }}
                  className={`${
                    active
                      ? "bg-text text-interactive_text p-2"
                      : "text-interactive_text bg-link p-2 dark:text-text"
                  }`}
                >
                  Event
                </span>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <span
                  onClick={(e) => {
                    fn(e);
                  }}
                  className={`${
                    active
                      ? "bg-text text-interactive_text p-2"
                      : "text-interactive_text bg-link p-2 dark:text-text"
                  }`}
                >
                  Tickets Left
                </span>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <span
                  onClick={(e) => {
                    fn(e);
                  }}
                  className={`${
                    active
                      ? "bg-text text-interactive_text p-2"
                      : "text-interactive_text bg-link p-2 dark:text-text"
                  }`}
                >
                  Organizer
                </span>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <span
                  onClick={(e) => {
                    fn(e);
                  }}
                  className={`${
                    active
                      ? "bg-text text-interactive_text p-2"
                      : "text-interactive_text bg-link p-2 dark:text-text"
                  }`}
                >
                  Location
                </span>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default SortEvents;
