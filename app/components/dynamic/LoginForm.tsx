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
  const [working, setWorking] = useState(false);
  const [notify, setNotify] = useState<NotificationObj>({
    error: false,
    message: "",
    show: false,
  });
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    setWorking(true);
    try {
      const resp = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (resp?.error) {
        setWorking(false);
        setNotify({ error: true, show: true, message: "Invalid Credentials" });
      } else {
        setWorking(false);
        router.refresh();
      }
    } catch (error) {
      setWorking(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (cleanUp && !isOpen) {
      cleanUp();
    }
  }, [isOpen]);
  return (
    <>
      {show ? (
        <></>
      ) : (
        <Button
          setW="w-[10ch]"
          title="Log in"
          text="log in"
          fn={() => {
            setOpen(true);
          }}
        />
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          onClose={() => {
            setOpen(false);
          }}
          as="div"
          className={"relative z-50"}
        >
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/20" aria-hidden />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel
                className={
                  "dark:bg-bg_interactive animate-fadeIn bg-interactive p-8 text-text shadow-md shadow-black dark:bg-sidebar"
                }
              >
                <Dialog.Title className={"p-2 text-center text-xl font-bold"}>
                  Log In
                </Dialog.Title>
                <Dialog.Description className={"p-8 text-lg font-semibold"}>
                  Log in to your account
                </Dialog.Description>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="flex justify-between p-4">
                    <label htmlFor="username" className="mr-2 w-[10ch] p-1">
                      Username
                    </label>
                    <input
                      id="username"
                      onChange={(e) => setUsername(e.currentTarget.value)}
                      className="min-w-[15ch] p-1 text-black ring-1 ring-text active:ring-link"
                      type="text"
                    />
                  </div>
                  <div className="flex justify-between p-4">
                    <label htmlFor="password" className="mr-2 w-[10ch] p-1">
                      Password
                    </label>
                    <input
                      id="password"
                      onChange={(e) => setPassword(e.currentTarget.value)}
                      className="min-w-[15ch] p-1 text-black ring-1 ring-text active:ring-link"
                      type="password"
                    />
                  </div>
                </form>

                <div className="flex justify-around py-8">
                  {working ? (
                    <Button
                      title="Log in"
                      setW="w-[10ch]"
                      ariaLabel="Log in"
                      text="Working..."
                      Icon={FaCog}
                      active
                      spinIcon
                      interactive={false}
                      fn={() => {
                        if (working) {
                          return;
                        } else {
                          handleLogin(username, password);
                        }
                      }}
                    />
                  ) : (
                    <Button
                      title="Log in"
                      setW="w-[10ch]"
                      ariaLabel="Log in"
                      text="log in"
                      fn={() => handleLogin(username, password)}
                    />
                  )}
                  <Button
                    ariaLabel="Cancel log in"
                    bgColor="bg-secondary"
                    title="Cancel"
                    setW="w-[10ch]"
                    text="Cancel"
                    fn={() => {
                      setOpen(false);
                    }}
                  ></Button>
                </div>
                <Notification
                  message={notify.message}
                  show={notify.show}
                  error={notify.error}
                  onAnimEnd={() =>
                    setNotify({ error: false, message: "", show: false })
                  }
                />

                <div className="flex flex-col items-center border-t-2 border-primary pt-8 ">
                  <span className="self-start p-4">
                    Don&apos;t have an account?
                  </span>
                  <Button
                    ariaLabel="Open register form"
                    setW="w-[10ch]"
                    size="text-sm"
                    text="Register"
                    title="Open Register form"
                    fn={() => {
                      if (cleanUp && switchFn) {
                        cleanUp();
                        switchFn();
                      }
                    }}
                  />
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
