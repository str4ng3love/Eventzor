"use client";

import { useState } from "react";

import { Listbox } from "@headlessui/react";
import Button from "../Button";
import Notification from "../../static/Notification";

interface Props {
  fn: (shippingData: {
    method: ShippingMethod;
    phoneNumber?: number;
    adress?: string;
  }) => void;
  method: ShippingMethod;
  adress?:string;
  phone?:number;
}
export enum ShippingMethod {
  postal = "Postal",
  email = "Email",
  priorityMail = "Priority Mail",
}
const ShippingForm = ({ fn, method, adress, phone }: Props) => {
  //export to Shopingcart.tsx
  const [selected, setSelected] = useState(method);
  const [notify, setNotify] = useState({
    message: "",
    error: false,
    show: false,
  });
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(method);
  const [shippingPhone, setPhone] = useState<number | undefined>();
  const [shippingAdress, setAdress] = useState<string | undefined>();
  return (
    <>
      <div className="flex flex-col">
        <div className="flex my-1 items-center">
          <label className="w-[14ch] whitespace-nowrap p-1">
            Shipping method
          </label>
          <Listbox value={selected} onChange={setSelected}>
            <Listbox.Button
              className={`p-2 cursor-pointer w-fit relative hover:bg-link transition-all duration-300`}
            >
              {selected}
            </Listbox.Button>
            <Listbox.Options className={`bg-black flex flex-row`}>
              <Listbox.Option
                onClick={(e) => {
                  setShippingMethod(ShippingMethod.postal);
                  setSelected(ShippingMethod.postal);
                }}
                className={`${
                  selected === "Postal" ? "hidden" : "block"
                } hover:bg-link p-2 transition-all duration-300`}
                value={"Postal"}
              >
                Postal
              </Listbox.Option>

              <Listbox.Option
                onClick={(e) => {
                  setShippingMethod(ShippingMethod.priorityMail);
                  setSelected(ShippingMethod.priorityMail);
                }}
                className={`${
                  selected === "Priority Mail" ? "hidden" : "block"
                } hover:bg-link p-2 transition-all duration-300`}
                value={"Priority Mail"}
              >
                Priority Mail
              </Listbox.Option>
              <Listbox.Option
                onClick={(e) => {
                  setShippingMethod(ShippingMethod.email);
                  setSelected(ShippingMethod.email);
                }}
                className={`${
                  selected === "Email" ? "hidden" : "block"
                } hover:bg-link p-2 transition-all duration-300`}
                value={"Email"}
              >
                Email
              </Listbox.Option>
            </Listbox.Options>
          </Listbox>
        </div>
        {shippingMethod !== ShippingMethod.email ? (
          <>
            <div className="flex my-1">
              <label className="w-[14ch] whitespace-nowrap p-1">
                Mailing Adress
              </label>
              <textarea
                placeholder="00-234 Imagineville Warden st. 200/2"
                className="p-1 w-[24ch] text-black resize-none h-[10rem]"
                onInput={(e) => setAdress(e.currentTarget.value)}
                value={shippingAdress}
              />
            </div>
            <div className="flex my-1 ">
              <label className="w-[14ch] whitespace-nowrap p-1">
                Phone Number
              </label>
              <input
                value={shippingPhone}
                className="p-1 w-[24ch] h-fit text-black"
                type="number"
                onInvalid={() =>
                  setNotify({
                    error: true,
                    show: true,
                    message: `Please provide a number`,
                  })
                }
                onChange={(e) => {
                  if (Number.isNaN(parseInt(e.currentTarget.value))) {
                    return;
                  } else {
                    setPhone(parseInt(e.currentTarget.value));
                  }
                }}
              />
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="flex justify-end py-8">
          <Button
            title="Confirm"
            text="Confirm"
            fn={() => {
           
              if (shippingMethod === ShippingMethod.email) {
                fn({
                  method: shippingMethod,
                  adress: adress,
                  phoneNumber: phone,
                });
              } else {
                if ((shippingPhone === undefined) || shippingAdress === undefined) {
                  setNotify({ error: true, message: "Please provide missing values", show: true });
                } else if(typeof(shippingPhone) !== 'number'){
                  setNotify({ error: true, message: "Phone number has to be a number", show: true });
                }else {
                  fn({method:shippingMethod, adress:shippingAdress, phoneNumber:shippingPhone})
                }
              }
            }}
          />
        </div>
      </div>
      <>
        <Notification
          show={notify.show}
          error={notify.error}
          message={notify.message}
          onAnimEnd={() => {
            setNotify({ error: false, message: "", show: false });
          }}
        />
      </>
    </>
  );
};

export default ShippingForm;
