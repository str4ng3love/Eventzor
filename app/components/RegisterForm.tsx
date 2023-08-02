"use client";
import { useState, Fragment, useEffect } from "react";
import Button from "./Button";
import { Dialog, Transition } from "@headlessui/react";

const RegisterForm = () => {
  const [isOpen, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [notify, setNotify] = useState({
    show: false,
    message: "",
    error: false,
  });
  const handleRegister = async (username: string, password: string, confirm:string, email:string) => {
    const resp = await fetch("/api/auth/create", {
      method: "POST",
      headers: {
        "Content-Type": "Application/Json",
      },
      body: JSON.stringify({ username, password,confirm, email }),
    });
    const respParsed = await resp.json();
    respParsed.message
      ? setNotify({ show: true, message: respParsed.message, error: false })
      : setNotify({ show: true, message: respParsed.error, error: true });
  };

  useEffect(() => {}, [notify]);
  return (
    <>
      <Button text="register" fn={() => setOpen(true)} />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={"z-50 relative"}
          open={isOpen}
          onClose={() => setOpen(false)}
        >
          <div className="bg-black/20 fixed inset-0" aria-hidden />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              className={
                "p-8 bg-bg_interactive text-text dark:bg-bg_interactive max-w-md w-[28rem]"
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
                  <label className="p-1 min-w-[10ch] mr-2">Email adress</label>
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
              {notify.show ? (
                <>
                  {notify.error ? (
                    <div
                      onAnimationEnd={() =>
                        setNotify({ error: false, message: "", show: false })
                      }
                      className="text-center flex justify-center items-center bg-secondary rounded-md animate-growAndShrink font-semibold"
                    >
                      {notify.message}
                    </div>
                  ) : (
                    <div
                      onAnimationEnd={() =>
                        setNotify({ error: false, message: "", show: false })
                      }
                      className="text-center flex justify-center items-center bg-link rounded-md animate-growAndShrink font-semibold"
                    >
                      {notify.message}
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}

              <div className="flex justify-around pt-8">
                <Button
                  text="register"
                  fn={() => {
                    handleRegister(username, password, confirm, email);
                  }}
                />
                <Button text="Cancel" fn={() => setOpen(false)}></Button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default RegisterForm;
