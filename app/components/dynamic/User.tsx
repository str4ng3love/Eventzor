"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { BiLogOut, BiSolidDashboard, BiUser } from "react-icons/bi";
import LoginForm from "./LoginForm";
import Logout from "./Logout";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";

const User = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <Menu as="div">
          <Menu.Button className={`cursor-pointer p-2 hover:bg-link transition-all duration-300`}>{session?.user?.name}</Menu.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items>
              <div className="absolute  mt-2 bg-black">
                <div className="my-1 flex justify-start items-center">
                  <Menu.Item>
                    {({ active }) => (
                      <Link href={"/dashboard"} className={`${active ? "bg-link":""} p-2 flex justify-start items-center transition-all duration-300`}>
                        Dashboard <span className="ml-4"><BiSolidDashboard /></span>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="my-1">
                  <Menu.Item>
                  {({ active }) => (
                    <span
                      className={`${active ? "bg-link":""} p-2 flex justify-start items-center transition-all duration-300`}
                      onClick={() => signOut()}
                    >
                      Logout
                      <span className="ml-4">
                        <BiLogOut />
                      </span>
                    </span>
                       )}
                  </Menu.Item>
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </>
    );
  } else {
    return (
      <>
        <div
          onClick={() => setShowLogin(true)}
          className="p-2 hover:bg-link rounded-md cursor-pointer transition-all duration-300"
        >
          <BiUser />
        </div>
        {showLogin ? (
          <LoginForm show={true} cleanUp={() => setShowLogin(false)} />
        ) : (
          <></>
        )}
      </>
    );
  }
};

export default User;
