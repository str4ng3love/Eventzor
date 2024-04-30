"use client";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";
interface Props {
  size?: string;
  buttonTitle: string;
  items: { label: string; href: string }[];
  bgColor?: string;
}
const DropDownNav = ({ items, buttonTitle }: Props) => {
  const emitEvent = () => {
    const event = new Event("closeBurger");
    window.dispatchEvent(event);
  };

  return (
    <div className="z-50">
      <Menu>
        <Menu.Button
          className={`block w-[12ch] cursor-pointer p-4 font-bold uppercase transition-all duration-300 hover:bg-link`}
        >
          {buttonTitle}
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
            className={`shadow-bg_sidebar absolute z-20 mt-1 flex w-56 origin-top-right flex-col rounded-md shadow-lg ring-2 ring-primary focus:outline-none`}
          >
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <Link
                    onClick={() => emitEvent()}
                    href={item.href}
                    className={`${
                      active
                        ? "bg-link p-2 text-contrast dark:text-text"
                        : "bg-bg p-2 text-text"
                    } first-letter:uppercase`}
                  >
                    {item.label}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default DropDownNav;
