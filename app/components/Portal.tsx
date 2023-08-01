"use client";
import { ReactNode } from "react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: ReactNode;
}
const Portal = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? createPortal(<>{children}</>, document.body) : null;
};

export default Portal;
