"use client";
import { useState, Fragment } from "react";
import Button from "./Button";
import { Dialog, Transition } from "@headlessui/react";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
    <Button fn={()=>signIn()} text="sign in with nextauth"/>
      <Button text="login" fn={() => setOpen(true)} />
      
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={"z-50 relative"}
          open={isOpen}
          onClose={() => setOpen(false)}
        >
          <div className="bg-black/20 fixed inset-0" aria-hidden />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className={"p-8 bg-bg_interactive text-text dark:bg-bg_interactive"}>
              <Dialog.Title className={"p-2 font-bold text-xl text-center"}>
                Log In
              </Dialog.Title>
              <Dialog.Description className={"p-8 text-lg font-semibold"}>
                Log in to your account
              </Dialog.Description>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="p-4 flex justify-between">
                  <label className="p-1 min-w-[10ch] mr-2">Username</label>
                  <input className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text" type="text" />
                </div>
                <div className="p-4 flex justify-between">
                  <label className="p-1 min-w-[10ch] mr-2">Password</label>
                  <input className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text" type="password" />
                </div>
              </form>
              <div className="flex justify-around pt-8">
              <Button text="log in" fn={()=>{}}/>
              <Button text="Cancel" fn={() => setOpen(false)}></Button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default LoginForm;
