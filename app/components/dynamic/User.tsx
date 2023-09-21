"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { BiLogOut, BiSolidDashboard, BiUser } from "react-icons/bi";
import LoginForm from "./LoginForm";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";

const User = () => {
  const [showLogin, setShowLogin] = useState(false);

  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <Menu as="div">
          <Menu.Button
          
            className={`cursor-pointer p-2 hover:bg-link transition-all duration-300`}
          >
            {session?.user?.name}
          </Menu.Button>
      
            <Menu.Items className={` absolute z-50 mt-2 bg-black`}>
              <div className="my-1 flex justify-start items-center ">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={"/dashboard"}
                      className={`${
                        active ? "bg-link" : ""
                      } p-2 flex justify-start items-center transition-all duration-300`}
                    >
                      Dashboard{" "}
                      <span className="ml-4">
                        <BiSolidDashboard />
                      </span>
                    </Link>
                  )}
                </Menu.Item>
              </div>
              <div className="my-1">
                <Menu.Item>
                  {({ active }) => (
                    <span
                      className={`${
                        active ? "bg-link" : ""
                      } p-2 flex justify-start items-center transition-all duration-300`}
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
            </Menu.Items>
        
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
