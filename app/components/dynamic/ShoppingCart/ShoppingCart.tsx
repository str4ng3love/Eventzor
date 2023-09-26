"use client";

import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment, useEffect } from "react";
import { BiCart } from "react-icons/bi";
import CartButton from "./CartButton";
import Button from "../Button";
import Currency from "../Currency";
import CartItem from "./CartItem";

export interface CartItemData {
  id: string;
  amount: number;
  type: string;
  price: number;
  item: string;
}
const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [total, setTotal] = useState<number>();
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [newEntries, setNewEntries] = useState(0);
  const [currency, setCurrency] = useState({ name: "usd", rate: 1 });

  const calcTotal = (arr: CartItemData[]) => {

    const total = arr.reduce((acc, val) => {
      acc = acc + val.price * currency.rate * val.amount;
      return parseFloat(acc.toFixed(2));
    }, 0);
    setTotal(total);
  };
  const updateCart = (data: CartItemData[]) => {
    if (data.length > 0) {
      localStorage.setItem("cart", JSON.stringify(data));
    } else {
      localStorage.removeItem("cart");
    }
  };
  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      let cartItems = JSON.parse(cart);
      setNewEntries(cartItems.length);
    }
    window.addEventListener("storage", () => {
      const cart = localStorage.getItem("cart");
      if (cart) {
        let cartItems = JSON.parse(cart);
        setNewEntries(cartItems.length);
      }
    });
    window.addEventListener("currency", () => {
      const currency = localStorage.getItem("currency");
      if (currency) {
        let selectedCurrency = JSON.parse(currency);
        setCurrency({
          name: selectedCurrency.name,
          rate: selectedCurrency.rate,
        });
      
      }
    });

    return () => {
      window.removeEventListener("storage", () => {});
      window.removeEventListener("currency", () => {});
    };
  }, []);
  useEffect(() => {
    let cart = localStorage.getItem("cart");
    if (cart && JSON.parse(cart)) {
      let cartItems: CartItemData[] = JSON.parse(cart);
      setCartItems(cartItems);
      calcTotal(cartItems);
      setIsLoadingItems(false);
    } else {
      setCartItems([]);
      setIsLoadingItems(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let prefCurrency = localStorage.getItem("currency");
    if (prefCurrency) {
      let selectedCurrency = JSON.parse(prefCurrency);
      setCurrency({
        name: selectedCurrency.name,
        rate: selectedCurrency.rate,
      });
    }
  }, [isOpen]);
  useEffect(() => {
    updateCart(cartItems);
    setNewEntries(cartItems.length);
   calcTotal(cartItems);
  }, [cartItems]);
  return (
    <>
      <CartButton
        newEntries={newEntries}
        title="Shopping Cart"
        size="1em"
        bgColor="bg-link"
        fn={() => setIsOpen(true)}
        Icon={BiCart}
      />
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
                  "p-8 bg-bg_interactive text-text dark:bg-bg_interactive shadow-md shadow-black min-w-1/3  min-h-[20rem] min-w-[30rem]"
                }
              >
                <Dialog.Title className={"font-bold text-xl text-start pb-2"}>
                  Shopping Cart
                </Dialog.Title>
                <Dialog.Description className={"text-sm font-semibold"}>
                  Manage your Items
                </Dialog.Description>
                <div className="flex justify-end">
                  <Currency
                    currentCurrency={{
                      name: currency.name,
                      exchangeRateToUSD: currency.rate,
                    }}
                  />
                </div>
                <div className="flex flex-col p-4 mt-8">
                  {isLoadingItems ? (
                    <h3>Loading ...</h3>
                  ) : (
                    <>
                      {cartItems.length > 0 ? (
                        cartItems.map((i, index) => (
                          <CartItem
                            closeFn={(e) => setIsOpen(false)}
                            id={i.id}
                            key={index}
                            type={i.type}
                            item={i.item}
                            amount={i.amount}
                            price={i.price}
                            currency={currency}
                            delFn={() => {
                              setCartItems((prev) => [
                                ...prev.filter((p) => p.id != i.id),
                              ]);
                            }}
                          />
                        ))
                      ) : (
                        <h3>Your Cart is Empty</h3>
                      )}
                    </>
                  )}
                </div>

                {!isLoadingItems && cartItems.length > 0 ? (
                  <div className="flex justify-end">
                    <div className=" ring-4 ring-primary p-2 text-xl font-bold">
                      <span className="mr-1">Total :</span>
                      <span className="mr-1">{total}</span>
                      <span>{currency.name.toLocaleUpperCase()}</span>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {cartItems.length > 0 ? (
                  <div className="flex items-center justify-center h-full pt-10">
                    <Button
                      title="Continue"
                      text="Continue"
                      fn={(e) => setIsOpen(false)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full pt-10">
                    <Button
                      title="Close"
                      text="Close"
                      fn={(e) => setIsOpen(false)}
                    />
                  </div>
                )}
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default ShoppingCart;
