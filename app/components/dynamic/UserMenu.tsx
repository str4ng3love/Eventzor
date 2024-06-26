"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { BiLogOut, BiSolidDashboard, BiUser } from "react-icons/bi";
import LoginForm from "./LoginForm";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import { TbFileSpreadsheet } from "react-icons/tb";
import RegisterForm from "./RegisterForm";

const UserMenu = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { data: session } = useSession();

  const emitEvent = () => {
    const event = new Event("closeBurger");
    window.dispatchEvent(event);
  };

  if (session) {
    return (
      <>
        <Menu as="div">
          <Menu.Button
            className={`cursor-pointer p-2 transition-all duration-300 hover:bg-link`}
          >
            {session?.user?.name}
          </Menu.Button>

          <Menu.Items
            className={` absolute z-50 mt-1 bg-bg text-text ring-2 ring-primary`}
          >
            <Menu.Item>
              {({ active }) => (
                <Link
                  onClick={() => emitEvent()}
                  href={"/dashboard"}
                  className={`${
                    active ? "bg-link text-contrast dark:hover:text-text" : ""
                  } flex items-center justify-between p-2 transition-all duration-300`}
                >
                  Dashboard{" "}
                  <span className="ml-4">
                    <BiSolidDashboard />
                  </span>
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <Link
                  onClick={() => emitEvent()}
                  href={"/orders"}
                  className={`${
                    active ? "bg-link text-contrast dark:hover:text-text" : ""
                  } flex items-center justify-between p-2 transition-all duration-300`}
                >
                  Orders
                  <span className="ml-4">
                    <TbFileSpreadsheet />
                  </span>
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <span
                  className={`${
                    active ? "bg-link text-contrast dark:hover:text-text" : ""
                  } flex cursor-pointer items-center  justify-between p-2 transition-all duration-300`}
                  onClick={() => {
                    emitEvent();
                    signOut();
                  }}
                >
                  Logout
                  <span className="ml-4">
                    <BiLogOut />
                  </span>
                </span>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </>
    );
  } else {
    return (
      <>
        <button
          aria-label="Log in or register"
          onClick={() => setShowLogin(true)}
          className="cursor-pointer rounded-md p-2 transition-all duration-300 hover:bg-link"
        >
          <BiUser />
        </button>
        {showLogin ? (
          <LoginForm
            show={true}
            cleanUp={() => setShowLogin(false)}
            switchFn={() => setShowRegister(true)}
          />
        ) : null}
        {showRegister ? (
          <RegisterForm
            show={true}
            cleanUp={() => setShowRegister(false)}
            switchFn={() => setShowLogin(true)}
          />
        ) : null}
      </>
    );
  }
};

export default UserMenu;
