"use client";
import { useState, Fragment, useEffect } from "react";
import Notification from "../static/Notification";
import { NotificationObj } from "../static/Notification";
import Button from "./Button";
import { Dialog, Transition } from "@headlessui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaCog } from "react-icons/fa";



interface Props {
  show?: boolean;
  cleanUp?: () => void;
  switchFn?: () => void;
}
const LoginForm = ({ show = false, cleanUp, switchFn }: Props) => {

  const [isOpen, setOpen] = useState(show);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [working, setWorking] = useState(false)
  const [notify, setNotify] = useState<NotificationObj>({
    error: false,
    message: "",
    show: false,
  });
  const router = useRouter()

  const handleLogin = async (username: string, password: string) => {
    setWorking(true)
    try {
      const resp = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (resp?.error) {
        setWorking(false)
        setNotify({ error: true, show: true, message: "Invalid Credentials" });
      } else {
        setWorking(false)
        router.refresh()
      }
    } catch (error) {
      setWorking(false)
      console.log(error)
    }

  };

  useEffect(() => {
    if (cleanUp && !isOpen) {
      cleanUp()
    }
  }, [isOpen])
  return (
    <>
      {show ? <></> : <Button title="Log in" text="log in" fn={() => { setOpen(true) }} />}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          onClose={() => { setOpen(false); }}
          as="div"
          className={"z-50 relative"}
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
                  "p-8 bg-interactive dark:bg-sidebar text-text dark:bg-bg_interactive shadow-md shadow-black animate-fadeIn"
                }
              >
                <Dialog.Title className={"p-2 font-bold text-xl text-center"}>
                  Log In
                </Dialog.Title>
                <Dialog.Description className={"p-8 text-lg font-semibold"}>
                  Log in to your account
                </Dialog.Description>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="p-4 flex justify-between">
                    <label htmlFor="username" className="p-1 w-[10ch] mr-2">Username</label>
                    <input
                      id="username"
                      onChange={(e) => setUsername(e.currentTarget.value)}
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text"
                      type="text"
                    />
                  </div>
                  <div className="p-4 flex justify-between">
                    <label htmlFor="password" className="p-1 w-[10ch] mr-2">Password</label>
                    <input
                      id="password"
                      onChange={(e) => setPassword(e.currentTarget.value)}
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text"
                      type="password"
                    />
                  </div>
                </form>


                <div className="flex justify-around py-8">
                  {working ?
                    <Button title="Log in"
                    setW="w-[10ch]"
                      ariaLabel="Log in"
                      text="Working..."
                      Icon={FaCog}
                      active
                      spinIcon
                      interactive={false}
                      fn={() => {
                        if (working) {
                          return
                        } else {
                          handleLogin(username, password)
                        }
                      }}
                    />
                    :
                    <Button title="Log in"
                    setW="w-[10ch]"
                      ariaLabel="Log in"
                      text="log in"
                      fn={() => handleLogin(username, password)}
                    />}
                  <Button ariaLabel="Cancel log in" bgColor="bg-secondary" title="Cancel" setW="w-[10ch]" text="Cancel" fn={() => { setOpen(false) }}></Button>
                </div>
                <Notification
                  message={notify.message}
                  show={notify.show}
                  error={notify.error}
                  onAnimEnd={() =>
                    setNotify({ error: false, message: "", show: false })
                  }
                />

                <div className="flex flex-col items-center pt-8 border-t-2 border-primary ">

                  <span className="p-4 self-start">Don&apos;t have an account?</span>
                  <Button ariaLabel="Open register form" setW="w-[10ch]" size="text-sm" text="Register" title="Open Register form" fn={() => { if (cleanUp && switchFn) { cleanUp(); switchFn() } }} />
                </div>
              </Dialog.Panel>

            </div>
          </Transition.Child>

        </Dialog>
      </Transition>
    </>
  );
};

export default LoginForm;
