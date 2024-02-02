"use client";
import { useState, Fragment, useEffect } from "react";
import Button from "./Button";
import { Dialog, Transition } from "@headlessui/react";
import Notification from "../static/Notification";
import { NotificationObj } from "../static/Notification";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface Props {
  show?: boolean;
  cleanUp?: () => void;
  switchFn?: () => void;
}
const RegisterForm = ({ cleanUp, show, switchFn }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [notify, setNotify] = useState<NotificationObj>({
    error: false,
    message: "",
    show: false,
  });
  const router = useRouter()
  const handleRegister = async (
    username: string,
    password: string,
    confirm: string,
    email: string
  ) => {
    const resp = await fetch("/api/auth/create", {
      method: "POST",
      headers: {
        "Content-Type": "Application/Json",
      },
      body: JSON.stringify({ username, password, confirm, email }),
    });
    const respParsed = await resp.json();
    if (respParsed.error) {
      setNotify({ show: true, error: true, message: respParsed.error.message })
    } else {
      const resp = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (resp?.error) {
        setNotify({ show: true, error: true, message: "Something went wrong." })
      } else {
        router.refresh()
      }
    }
  };
  useEffect(() => {
    if (cleanUp && !isOpen) {
      cleanUp()
    }
  }, [isOpen])
  return (
    <>
      <Button title="Register an account" text="register" fn={() => setOpen(true)} />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={"z-50 relative"}
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="bg-black/20 fixed inset-0" aria-hidden />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel
                className={
                  "p-8 bg-bg_interactive text-text dark:bg-bg_interactive max-w-md w-[28rem]  shadow-md shadow-black"
                }
              >
                <Dialog.Title className={"p-2 font-bold text-xl text-center"}>
                  Register
                </Dialog.Title>
                <Dialog.Description className={"p-8 text-lg font-semibold"}>
                  Create an account
                </Dialog.Description>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">
                      Email address
                    </label>
                    <input
                      onChange={(e) => setEmail(e.currentTarget.value)}
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text"
                      type="text"
                    />
                  </div>
                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">Username</label>
                    <input
                      onChange={(e) => setUsername(e.currentTarget.value)}
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text"
                      type="text"
                    />
                  </div>
                  <div className="p-4 flex justify-between">
                    <label className="p-1 min-w-[10ch] mr-2">Password</label>
                    <input
                      onChange={(e) => setPassword(e.currentTarget.value)}
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text"
                      type="password"
                    />
                  </div>
                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">Confirm</label>
                    <input
                      onChange={(e) => setConfirm(e.currentTarget.value)}
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text"
                      type="password"
                    />
                  </div>
                </form>


                <div className="flex justify-around pt-8">
                  <Button
                    title="Register"
                    text="register"
                    fn={() => {
                      handleRegister(username, password, confirm, email);
                    }}
                  />
                  <Button title="Cancel registration" text="Cancel" fn={() => setOpen(false)}></Button>
                </div>
                <Notification
                  message={notify.message}
                  show={notify.show}
                  error={notify.error}
                  onAnimEnd={() => { setNotify({ error: false, message: "", show: false }); setOpen(false) }
                  }
                />
                <div className="flex flex-col justify-around pt-8 ">

                  <span className="p-4">Already have an account?</span>
                  <Button text="Register" title="Open Login form" fn={() => { if (cleanUp && switchFn) { cleanUp(); switchFn() } }} />
                </div>
              </Dialog.Panel>
            </div>

          </Transition.Child>

        </Dialog>

      </Transition>
    </>
  );
};

export default RegisterForm;
