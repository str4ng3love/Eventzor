'use client'
import { Menu, Transition } from "@headlessui/react"
import Link from "next/link";
import { Fragment } from "react"
interface Props {

    size?: string;
    buttonTitle: string;
    items: { label: string, href: string }[];
    bgColor?: string;
}
const DropDownNav = ({ items, buttonTitle, }: Props) => {
    const emitEvent = () => {
        const event = new Event('closeBurger')
        window.dispatchEvent(event)
    }

    return (
        <div className="z-50">
            <Menu>

                <Menu.Button className={`uppercase font-bold hover:text-white hover:bg-link transition-all duration-300 block p-4 w-[12ch]`}>
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
                    <Menu.Items className={`z-20 absolute flex mt-1 flex-col origin-top-right w-56 bg-white shadow-bg_sidebar shadow-lg rounded-md focus:outline-none `}>
                        {items.map((item, index) =>
                            <Menu.Item key={index}>
                                {({ active }) => (
                                    <Link onClick={()=>emitEvent()} href={item.href} className={`${active
                                        ? "bg-text text-interactive_text p-2"
                                        : "text-interactive_text bg-link p-2 dark:text-text"
                                        } first-letter:uppercase`}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </Menu.Item>)}
                    </Menu.Items>


                </Transition>
            </Menu>
        </div>
    )
}


export default DropDownNav