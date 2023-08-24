"use client";
import { BiHide, BiShow } from "react-icons/bi";
import { useState } from "react";
import { Heading4 } from "../../static/Heading";
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
    }
    try {
      const resp = await fetch('/api/user/password', {method: "POST", headers: {
        "Content-Type":"Application/Json"
      }, body: JSON.stringify({password, newPassword, confirmPassword})})
      const data = await resp.json()
      if(data.error){
        setCanChangePass(true)
        setNotify({error: true, show: true, message: data.error})
      } else {
        setCanChangePass(true)
        setNotify({error: false, show: true, message: data.message})
      }
    } catch (error) {
      console.log(error)
    }
   
  };
  return (
    <>
      <div className="flex flex-col w-fit p-4 my-4">
        <Heading4 text="Change your password" />
        <div className="p-4 flex gap-2">
          {show.password ? (
            <>
              <label className="p-1 w-[16ch]">Password</label>
              <input
                className="p-1 text-interactive_text"
                type="text"
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
              <ButtonWithIcon Icon={BiHide} size="1em" fn={()=>setShow((prev)=>({...prev, password: false}))}/>
            </>
          ) : (
            <>
              <label className="p-1 w-[16ch]">Password</label>
              <input
                className="p-1 text-interactive_text"
                type="password"
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
              <ButtonWithIcon Icon={BiShow} size="1em" fn={()=>setShow((prev)=>({...prev, password: true}))}/>
            </>
          )}
        </div>
        <div className="p-4 flex gap-2">
        {show.newPassword ? (
            <>
              <label className="p-1 w-[16ch]">New Password</label>
              <input
                className="p-1 text-interactive_text"
                type="text"
                onInput={(e) => setNewPassword(e.currentTarget.value)}
              />
              <ButtonWithIcon Icon={BiHide} size="1em" fn={()=>setShow((prev)=>({...prev, newPassword: false}))}/>
            </>
          ) : (
            <>
              <label className="p-1 w-[16ch]">New Password</label>
              <input
                className="p-1 text-interactive_text"
                type="password"
                onInput={(e) => setNewPassword(e.currentTarget.value)}
              />
              <ButtonWithIcon Icon={BiShow} size="1em" fn={()=>setShow((prev)=>({...prev, newPassword: true}))}/>
            </>
          )}
        </div>
        <div className="p-4 flex gap-2">
        {show.confirmPassword ? (
            <>
              <label className="p-1 w-[16ch]">Confirm Password</label>
              <input
                className="p-1 text-interactive_text"
                type="text"
                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
              />
              <ButtonWithIcon Icon={BiHide} size="1em" fn={()=>setShow((prev)=>({...prev, confirmPassword: false}))}/>
            </>
          ) : (
            <>
              <label className="p-1 w-[16ch]">Confirm Password</label>
              <input
                className="p-1 text-interactive_text"
                type="password"
                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
              />
              <ButtonWithIcon Icon={BiShow} size="1em" fn={()=>setShow((prev)=>({...prev, confirmPassword: true}))}/>
            </>
          )}
        </div>
        <div className="flex p-8 justify-center">
          {canChangePass ? (
            <Button
              text="Update"
              fn={() => {
                setCanChangePass(false)
                handlePassChange();
              }}
            />
          ) : (
            <Button text="Updating..." fn={() => {}} bgColor={'bg-bg'} interactive={false} />
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
