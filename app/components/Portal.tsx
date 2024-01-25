"use client";
import { Dialog } from "@headlessui/react";
import { ReactNode } from "react";
import { useState } from "react";

interface Props {
  child: ReactNode;
  title?: string;
  desc?: string;
  styled?: boolean;
  cleanUp?: () => void;
}
const Portal = ({ child, desc, title, styled = true, cleanUp}: Props) => {
  const [isOpen, setIsOpen] = useState(true)


  return (


    <Dialog open={isOpen} onClose={() => { cleanUp ? cleanUp() : null; setIsOpen(false) }} className={``}>
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/10 backdrop-blur-sm">
        <Dialog.Panel className={`${styled ? "w-full max-w-5xl rounded bg-bg_interactive p-8 min-w-l shadow-omni max-h-[75%] overflow-auto" : ""}`}>
          <Dialog.Title>
            {title}
          </Dialog.Title>
          <Dialog.Description>
            {desc}
          </Dialog.Description>
          {child}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
};

export default Portal;
