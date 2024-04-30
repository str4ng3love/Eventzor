"use client";
import { useState } from "react";
import LoginForm from "./dynamic/LoginForm";
import RegisterForm from "./dynamic/RegisterForm";
import Button from "./dynamic/Button";

const Authenticate = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  return (
    <div className="flex justify-around gap-4 p-4">
      <Button
        setW="w-[10ch]"
        title="Log in"
        text="log in"
        fn={() => {
          setShowLogin(true);
        }}
      />
      <Button
        setW="w-[10ch]"
        title="Register"
        text="Register"
        fn={() => {
          setShowRegister(true);
        }}
      />
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
    </div>
  );
};

export default Authenticate;
