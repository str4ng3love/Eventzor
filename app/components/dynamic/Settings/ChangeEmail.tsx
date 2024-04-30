"use client";
import { useState } from "react";
import { Heading2 } from "../../static/Heading";
import { BiEdit, BiCheckSquare, BiX } from "react-icons/bi";
import Notification from "../../static/Notification";
import ButtonWithIcon from "../ButtonWithIcon";

const ChangeEmail = () => {
  const [email, setEmail] = useState<string>();
  const [showEdit, setShowEdit] = useState(false);
  const [notify, setNotify] = useState({
    error: false,
    show: false,
    message: "",
  });

  const handleEmailChange = async (email: string) => {
    try {
      const resp = await fetch("/api/user/email", {
        method: "POST",
        headers: { "content-type": "application-json" },
        body: JSON.stringify({ email }),
      });
      const dat = await resp.json();
      if (dat.error) {
        setNotify({ error: true, show: true, message: dat.error });
      } else {
        console.log(dat);
        setNotify({ error: false, show: true, message: dat.message });
        setShowEdit(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="my-4 flex w-fit flex-col p-4">
        <Heading2 text="Change your email address" />
        <div className="flex flex-col items-start gap-2 p-4 md:flex-row">
          <label htmlFor="emailaddress" className="w-[16ch] p-1">
            Email
          </label>
          {showEdit ? (
            <>
              <input
                id="emailaddress"
                className="w-full p-1 text-black"
                type="email"
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
              <div className="flex flex-row gap-2 self-end">
                <ButtonWithIcon
                  ariaLabel="click to show input field"
                  Icon={BiCheckSquare}
                  fn={() => {
                    if (email) {
                      handleEmailChange(email);
                    } else {
                      setNotify({
                        error: true,
                        show: true,
                        message: "Email field is empty",
                      });
                    }
                  }}
                  size="1em"
                />
                <ButtonWithIcon
                  ariaLabel="click to close input field"
                  Icon={BiX}
                  fn={() => setShowEdit(false)}
                  size="1em"
                  bgColor="bg-red-500"
                />
              </div>
            </>
          ) : (
            <>
              <span className="p-1">{email}</span>
              <ButtonWithIcon
                ariaLabel="click change your email"
                Icon={BiEdit}
                fn={() => setShowEdit(true)}
                size="1em"
              />
            </>
          )}
        </div>
        <div className="flex justify-center p-8"></div>
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

export default ChangeEmail;
