"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useState } from "react";
import { BiCheck, BiX } from "react-icons/bi";

interface Props {
  fn: (e: React.MouseEvent) => void;
  show: boolean;
  text: string
}
const ConfirmDialog = ({ show, fn, text }: Props) => {
  const [isOpen, setIsOpen] = useState(show);
  return (


    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={() => setIsOpen(false)}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-black/20 fixed inset-0" aria-hidden />
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
            <Dialog.Panel className={`p-4 ring-1 ring-primary rounded-sm bg-bg px-8 text-xl min-w-[20ch] flex flex-col justify-center`}>
              <Dialog.Title className={`flex justify-center`}>Confirm&nbsp;{text}?</Dialog.Title>
              <div className="flex justify-between pt-10">
                <button className="text-3xl hover:bg-link transition-all duration-300" onClick={(e) => fn(e)}>
                  <BiCheck />
                </button>
                <button className="text-3xl hover:bg-secondary transition-all duration-300" onClick={() => setIsOpen(false)}>
                  <BiX />
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>

  );
};

export default ConfirmDialog;
