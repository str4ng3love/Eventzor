"use client";
import Button from "./Button";
import { signOut } from "next-auth/react";
interface Props {
  size?: string;
}
const Logout = ({ size }: Props) => {
  return (
    <Button size={size} title="Log out" fn={() => signOut()} text="Log out" />
  );
};

export default Logout;
