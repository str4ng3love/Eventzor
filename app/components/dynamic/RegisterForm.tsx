"use client";
import { useState, Fragment, useEffect } from "react";
import Button from "./Button";
import { Dialog, Transition } from "@headlessui/react";
import Notification from "../static/Notification";
import { NotificationObj } from "../static/Notification";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaCog } from "react-icons/fa";
import { BiLogIn } from "react-icons/bi";

interface Props {
  show?: boolean;
  cleanUp?: () => void;
  switchFn?: () => void;
}
const RegisterForm = ({ cleanUp, show = false, switchFn }: Props) => {
  const [isOpen, setOpen] = useState(show);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [working, setWorking] = useState(false);
  const [loginWorking, setLoginWorking] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [notify, setNotify] = useState<NotificationObj>({
    error: false,
    message: "",
    show: false,
  });

  const router = useRouter();
  const handleLogin = async () => {
    try {
      setLoginWorking(true);
      const resp = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (resp?.error) {
        setLoginWorking(false);
        setNotify({
          error: true,
          show: true,
          message: "Something went wrong, please try again later",
        });
      } else if (resp?.ok) {
        setLoginWorking(false);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = async (
    username: string,
    password: string,
    confirm: string,
    email: string,
  ) => {
    try {
      setWorking(true);
      const resp = await fetch("/api/auth/create", {
        method: "POST",
        headers: {
          "Content-Type": "Application/Json",
        },
        body: JSON.stringify({ username, password, confirm, email }),
      });
      const respParsed = await resp.json();
      setWorking(false);
      if (respParsed.error) {
        setWorking(false);
        setNotify({ show: true, error: true, message: respParsed.error });
      } else {
        setWorking(false);
        setRegistered(true);
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
          title="Register an account"
          text="register"
          fn={() => setOpen(true)}
        />
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={"relative z-50"}
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
            <div className="fixed inset-0 bg-black/20" aria-hidden />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel
                className={
                  "dark:bg-bg_interactive w-[28rem] max-w-md animate-fadeIn bg-interactive p-8 text-text  shadow-md shadow-black dark:bg-sidebar"
                }
              >
                {!registered ? (
                  <>
                    <Dialog.Title
                      className={"p-2 text-center text-xl font-bold"}
                    >
                      Register
                    </Dialog.Title>
                    <Dialog.Description className={"p-8 text-lg font-semibold"}>
                      Create an account
                    </Dialog.Description>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="flex justify-between p-4 ">
                        <label
                          htmlFor="emailaddress"
                          className="mr-2 w-[10ch] p-1"
                        >
                          Email Address
                        </label>
                        <input
                          id="emailaddress"
                          onChange={(e) => setEmail(e.currentTarget.value)}
                          className=" h-fit  min-w-[15ch] p-1 text-black ring-1 ring-text active:ring-link"
                          type="text"
                        />
                      </div>
                      <div className="flex justify-between p-4 ">
                        <label htmlFor="username" className="mr-2 w-[10ch] p-1">
                          Username
                        </label>
                        <input
                          id="username"
                          onChange={(e) => setUsername(e.currentTarget.value)}
                          className=" h-fit  min-w-[15ch] p-1 text-black ring-1 ring-text active:ring-link"
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
                          className=" h-fit  min-w-[15ch] p-1 text-black ring-1 ring-text active:ring-link"
                          type="password"
                        />
                      </div>
                      <div className="flex justify-between p-4 ">
                        <label
                          htmlFor="passwordconfirm"
                          className="mr-2 w-[10ch] p-1"
                        >
                          Confirm Password
                        </label>
                        <input
                          id="passwordconfirm"
                          onChange={(e) => setConfirm(e.currentTarget.value)}
                          className=" h-fit  min-w-[15ch] p-1 text-black ring-1 ring-text active:ring-link"
                          type="password"
                        />
                      </div>
                    </form>

                    <div className="flex justify-around py-8">
                      {working ? (
                        <Button
                          title="Register button"
                          ariaLabel="register"
                          text="Working..."
                          Icon={FaCog}
                          active
                          spinIcon
                          interactive={false}
                          fn={() => {
                            if (working) {
                              return;
                            } else {
                              handleRegister(
                                username,
                                password,
                                confirm,
                                email,
                              );
                            }
                          }}
                        />
                      ) : (
                        <Button
                          ariaLabel="register"
                          setW="w-[10ch]"
                          title="Register"
                          text="register"
                          fn={() => {
                            handleRegister(username, password, confirm, email);
                          }}
                        />
                      )}
                      <Button
                        ariaLabel="cancel registration"
                        setW="w-[10ch]"
                        bgColor="bg-secondary"
                        title="Cancel registration"
                        text="Cancel"
                        fn={() => setOpen(false)}
                      ></Button>
                    </div>
                    <div className="flex flex-col items-center border-t-2 border-primary pt-8">
                      <span className="self-start p-4">
                        Already have an account?
                      </span>
                      <Button
                        ariaLabel="Open log in form"
                        setW="w-[10ch]"
                        text="Login"
                        size="text-sm"
                        title="Open Login form"
                        fn={() => {
                          if (cleanUp && switchFn) {
                            cleanUp();
                            switchFn();
                          }
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex animate-fadeIn flex-col items-center">
                    <h1 className="pb-16 text-xl font-semibold">
                      Registration Completed
                    </h1>

                    <Button
                      text="Log In"
                      title="Log in"
                      setW="w-[10ch]"
                      Icon={loginWorking ? FaCog : BiLogIn}
                      showIcon
                      ariaLabel="Log in"
                      interactive={!loginWorking}
                      active={loginWorking}
                      spinIcon={loginWorking}
                      fn={async () => {
                        if (loginWorking) {
                          return;
                        } else {
                          handleLogin();
                        }
                      }}
                    />
                  </div>
                )}
              </Dialog.Panel>
              <Notification
                message={notify.message}
                show={notify.show}
                error={notify.error}
                onAnimEnd={() => {
                  setNotify({ error: false, message: "", show: false });
                }}
              />
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default RegisterForm;
