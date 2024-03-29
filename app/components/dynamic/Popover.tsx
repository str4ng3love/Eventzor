"use client";

import { Popover, Transition } from "@headlessui/react";
import Button from "./Button";

interface Props {
  text: string;
  message: string;
  fn?: (e: React.MouseEvent) => void;
}
const InfoPopover = ({ text, message, fn }: Props) => {
  return (
    <Popover>
      <Popover.Button
        className={`relative cursor-pointer rounded-md bg-secondary p-1 px-2 text-xl font-bold transition-all hover:bg-red-400`}
      >
        {text}
      </Popover.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel
          className={`absolute left-[-50%] mt-2 flex flex-col items-center justify-center gap-4 bg-bg p-4 ring-2 ring-secondary`}
        >
          {message}
          {fn ? (
            <Button fn={(e) => fn(e)} title="edit item" text="Add some now" />
          ) : (
            <></>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default InfoPopover;
