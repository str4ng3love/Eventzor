"use client";
import { useState } from "react";
import { Heading4 } from "../../static/Heading";
import { BiEdit, BiCheckSquare, BiX } from "react-icons/bi";
import Button from "../Button";
import Notification from "../../static/Notification";
import ButtonWithIcon from "../ButtonWithIcon";
interface Props {
  userEmail: string;
}
const ChangeEmail = ({ userEmail }: Props) => {
  const [email, setEmail] = useState(userEmail);
  const [showEdit, setShowEdit] = useState(false);
  const [notify, setNotify] = useState({
    error: false,
    show: false,
    message: "",
  });

  const handleEmailChange = async (email: string) => {
    try {
   
      const resp = await fetch("/api/user/update-email", {
        method: "POST",
        headers: { "content-type": "application-json" },
        body: JSON.stringify({ email }),
      });
      const dat = await resp.json();
      if(dat.error){
        setNotify({error:true, show:true, message: dat.error})
      } else {
        setNotify({error:false, show:true, message: dat.message})
        setShowEdit(false)
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex flex-col w-fit p-4 my-4">
        <Heading4 text="Change your email adress" />
        <div className="p-4 flex gap-2 items-center">
          <label className="p-1 w-[16ch]">Email</label>
          {showEdit ? (
            <>
              <input
                className="p-1 text-interactive_text"
                type="email"
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
              <ButtonWithIcon
                Icon={BiCheckSquare}
                fn={() => {
                  handleEmailChange(email);
                }}
                size="1em"
              />
              <ButtonWithIcon
                Icon={BiX}
                fn={() => setShowEdit(false)}
                size="1em"
                bgColor="bg-red-500"
              />
            </>
          ) : (
            <>
              <span className="p-1">{email}</span>
              <ButtonWithIcon
                Icon={BiEdit}
                fn={() => setShowEdit(true)}
                size="1em"
              />
            </>
          )}
        </div>
        <div className="flex p-8 justify-center"></div>
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
