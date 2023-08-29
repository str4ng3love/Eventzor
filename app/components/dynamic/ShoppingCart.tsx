"use client";

import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment, useEffect } from "react";
import ButtonWithIcon from "./ButtonWithIcon";
import { BiCart } from "react-icons/bi";
import CartItem from "./CartItem";

const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [storage, setStorage] = useState([])
  const [items, setItems] = useState<{ id: string; amount: number }[]>([]);

  const fetchItem = async (id: string) => {
    try {
      const resp = await fetch(`/api/events/${id}`);
      const data = await resp.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  // TODO: trace and react to changes in local storage API
  useEffect(() => {
    let cart = localStorage.getItem("cart");
    if (cart && JSON.parse(cart) !==storage) {
      let cartItems = JSON.parse(cart);
      setStorage(cartItems)
    }
  }, [isOpen]);
  useEffect(()=>{
    (async () => {
      console.log("fetching")
      let fetchedItems = await Promise.all(
        storage.map((i: { id: string }) => fetchItem(i.id))
      );
      setItems(fetchedItems);
    })();
  }, [storage])
  return (
    <>
      <ButtonWithIcon title="Shopping Cart" size="1em" fn={() => setIsOpen(true)} Icon={BiCart} />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          onClose={() => {
            setIsOpen(false);
          }}
          as="div"
          className={"z-50 relative"}
        >
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="bg-black/20 fixed inset-0" aria-hidden />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel
                className={
                  "p-8 bg-bg_interactive text-text dark:bg-bg_interactive shadow-md shadow-black min-w-1/3  min-h-[20rem]"
                }
              >
                <Dialog.Title className={"font-bold text-xl text-start pb-2"}>
                  Shopping Cart
                </Dialog.Title>
                <Dialog.Description className={"text-sm font-semibold"}>
                  Manage your Items
                </Dialog.Description>
                <div className="flex flex-col p-4 mt-8 items-center justify-center">
                  {items.length >0? items.map((i, index) => (
                    <CartItem
                      key={index}
                      title={i.id}
                      amount={i.amount}
                      delFn={() => {
                        setItems((prev) => [
                          ...prev.filter((p) => p.id != i.id),
                        ]);
                      }}
                    />
                  )): <h4>Your Cart is Empty</h4>}
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default ShoppingCart;
