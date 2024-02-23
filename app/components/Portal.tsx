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
const Portal = ({ child, desc, title, styled = true, cleanUp }: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        cleanUp ? cleanUp() : null;
        setIsOpen(false);
      }}
      className={``}
    >
      <div className="fixed inset-0 z-50 flex w-screen items-center justify-center bg-black/10 p-4 backdrop-blur-sm sm:p-1">
        <Dialog.Panel
          className={`${styled ? "max-h-[75%] w-full max-w-5xl overflow-y-auto rounded bg-interactive  p-8 shadow-omni dark:bg-bg" : ""}`}
        >
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{desc}</Dialog.Description>
          {child}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Portal;
