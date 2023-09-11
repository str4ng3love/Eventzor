"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useState } from "react";
import { BiCheck, BiX } from "react-icons/bi";
interface Props {
  fn: (e:React.MouseEvent) => void;
  show: boolean;
}
const ConfirmDialog = ({ show, fn }: Props) => {
  const [isOpen, setIsOpen] = useState(show);
  console.log(isOpen)
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
          <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm">
            <Dialog.Panel>
              <Dialog.Title>Confirm&nbsp;?</Dialog.Title>
              <div>
                <button onClick={(e) => fn(e)}>
                  <BiCheck />
                </button>
                <button onClick={() => setIsOpen(false)}>
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
