"use client";
import { useState, Fragment, useEffect } from "react";
import Notification from "../static/Notification";
import { NotificationObj } from "../static/Notification";
import Button from "./Button";
import { Dialog, Transition } from "@headlessui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import RegisterForm from "./RegisterForm";


interface Props {
  show?: boolean;
  cleanUp?: ()=>void
}
const LoginForm = ({show=false, cleanUp}:Props) => {

  const [isOpen, setOpen] = useState(show);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notify, setNotify] = useState<NotificationObj>({
    error: false,
    message: "",
    show: false,
  });
  const router = useRouter()
  const handleLogin = async (username: string, password: string) => {
    const resp = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (resp?.error) {
      setNotify({ error: true, show: true, message: "Invalid Credentials" });
    } else {
      setNotify({
        error: false,
        show: true,
        message: "Logged in Successfully",
      });
      setTimeout(() => {
        setOpen(false);
        setNotify({ error: false, message: "", show: false });
     
        router.refresh()
      }, 2000);
    }
  };
useEffect(()=>{
  if(cleanUp && !isOpen){
    cleanUp()
  }
}, [isOpen])
  return (
    <>
      {show? <></>: <Button title="Log in" text="log in" fn={() => setOpen(true)} />}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          onClose={() => {setOpen(false);}}
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
                  "p-8 bg-bg_interactive text-text dark:bg-bg_interactive shadow-md shadow-black"
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
                </form>
           

                <div className="flex justify-around pt-8">
                  <Button

                  title="Log in"
                    text="log in"
                    fn={() => handleLogin(username, password)}
                  />
                  <Button title="Cancel" text="Cancel" fn={() => setOpen(false)}></Button>
                </div>
             
                <div className="flex flex-col justify-around pt-8 ">
             
             <span className="p-4">Don&apos;t have an account?</span>
            <RegisterForm />
                </div>
              </Dialog.Panel>
              <Notification
                  message={notify.message}
                  show={notify.show}
                  error={notify.error}
                  onAnimEnd={() =>
                    setNotify({ error: false, message: "", show: false })
                  }
                />
            </div>
        
          </Transition.Child>
    
        </Dialog>
      </Transition>
    </>
  );
};

export default LoginForm;
