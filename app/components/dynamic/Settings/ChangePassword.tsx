"use client";
import { BiHide, BiShow } from "react-icons/bi";
import { useState } from "react";
import { Heading2 } from "../../static/Heading";
import Button from "../Button";
import Notification from "../../static/Notification";
import ButtonWithIcon from "../ButtonWithIcon";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [canChangePass, setCanChangePass] = useState(true);
  const [show, setShow] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [notify, setNotify] = useState({
    error: false,
    show: false,
    message: "",
  });

  const handlePassChange = async () => {
    if (
      (password.length < 8, newPassword.length < 8, confirmPassword.length < 8)
    ) {
      setNotify({
        error: true,
        show: true,
        message: "Password has to be at least 8 characters long.",
      });
      setCanChangePass(true);
    }
    try {
      const resp = await fetch("/api/user/password", {
        method: "POST",
        headers: {
          "Content-Type": "Application/Json",
        },
        body: JSON.stringify({ password, newPassword, confirmPassword }),
      });
      const data = await resp.json();
      if (data.error) {
        setCanChangePass(true);
        setNotify({ error: true, show: true, message: data.error });
      } else {
        setCanChangePass(true);
        setNotify({ error: false, show: true, message: data.message });
      }
    } catch (error) {
      setCanChangePass(true);
      console.log(error);
    }
  };
  return (
    <>
      <div className="my-4 flex w-fit flex-col p-4">
        <Heading2 text="Change your password" />
        <div className="flex flex-col gap-2 p-4 sm:flex-row">
          {show.password ? (
            <>
              <label htmlFor="password" className="w-[16ch] p-1">
                Password
              </label>
              <div className="flex flex-row gap-2">
                <input
                  id="password"
                  className="p-1 text-text dark:text-contrast"
                  type="text"
                  onInput={(e) => setPassword(e.currentTarget.value)}
                />
                <ButtonWithIcon
                  ariaLabel="show content"
                  Icon={BiHide}
                  size="1em"
                  fn={() => setShow((prev) => ({ ...prev, password: false }))}
                />
              </div>
            </>
          ) : (
            <>
              <label htmlFor="password" className="w-[16ch] p-1">
                Password
              </label>
              <div className="flex flex-row gap-2">
                <input
                  id="password"
                  className="p-1 text-text dark:text-contrast"
                  type="password"
                  onInput={(e) => setPassword(e.currentTarget.value)}
                />
                <ButtonWithIcon
                  ariaLabel="hide content"
                  Icon={BiShow}
                  size="1em"
                  fn={() => setShow((prev) => ({ ...prev, password: true }))}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 p-4 sm:flex-row">
          {show.newPassword ? (
            <>
              <label htmlFor="newpassword" className="w-[16ch] p-1">
                New Password
              </label>
              <div className="flex flex-row gap-2">
                <input
                  id="newpassword"
                  className="p-1 text-text dark:text-contrast"
                  type="text"
                  onInput={(e) => setNewPassword(e.currentTarget.value)}
                />
                <ButtonWithIcon
                  ariaLabel="show content"
                  Icon={BiHide}
                  size="1em"
                  fn={() =>
                    setShow((prev) => ({ ...prev, newPassword: false }))
                  }
                />
              </div>
            </>
          ) : (
            <>
              <label htmlFor="newpassword" className="w-[16ch] p-1">
                New Password
              </label>
              <div className="flex flex-row gap-2">
                <input
                  id="newpassword"
                  className="p-1 text-text dark:text-contrast"
                  type="password"
                  onInput={(e) => setNewPassword(e.currentTarget.value)}
                />
                <ButtonWithIcon
                  ariaLabel="hide content"
                  Icon={BiShow}
                  size="1em"
                  fn={() => setShow((prev) => ({ ...prev, newPassword: true }))}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 p-4 sm:flex-row">
          {show.confirmPassword ? (
            <>
              <label htmlFor="confirmpassword" className="w-[16ch] p-1">
                Confirm Password
              </label>
              <div className="flex flex-row gap-2">
                <input
                  id="confirmpassword"
                  className="p-1 text-text dark:text-contrast"
                  type="text"
                  onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                />
                <ButtonWithIcon
                  ariaLabel="show content"
                  Icon={BiHide}
                  size="1em"
                  fn={() =>
                    setShow((prev) => ({ ...prev, confirmPassword: false }))
                  }
                />
              </div>
            </>
          ) : (
            <>
              <label htmlFor="confirmpassword" className="w-[16ch] p-1">
                Confirm Password
              </label>
              <div className="flex flex-row gap-2">
                <input
                  id="confirmpassword"
                  className="p-1 text-text dark:text-contrast"
                  type="password"
                  onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                />
                <ButtonWithIcon
                  ariaLabel="hide content"
                  Icon={BiShow}
                  size="1em"
                  fn={() =>
                    setShow((prev) => ({ ...prev, confirmPassword: true }))
                  }
                />
              </div>
            </>
          )}
        </div>
        <div className="flex justify-center p-8">
          {canChangePass ? (
            <Button
              setW="w-[10ch]"
              ariaLabel="update your password"
              title="Update your password"
              text="Update"
              fn={() => {
                setCanChangePass(false);
                handlePassChange();
              }}
            />
          ) : (
            <Button
              title="Working"
              text="Updating..."
              fn={() => {}}
              bgColor={"bg-bg"}
              interactive={false}
            />
          )}
        </div>
        <Notification
          error={notify.error}
          message={notify.message}
          show={notify.show}
          onAnimEnd={() =>
            setNotify({ error: false, show: false, message: "" })
          }
        />
      </div>
    </>
  );
};

export default ChangePassword;
