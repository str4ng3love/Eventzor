"use client";

import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment, useEffect } from "react";
import { BiCart } from "react-icons/bi";
import CartEventItem from "./CartEventItem";
import CartButton from "./CartButton";
import Button from "../Button";
import Currency from "../Currency";

interface EventItem {
  id: string;
  title: string;
  price: number;
}

const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [storage, setStorage] = useState<{ id: string; amount: number }[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventItems, setEventItems] = useState<EventItem[]>([]);
  const [newEntries, setNewEntries] = useState(0);
  const [currency, setCurrency] = useState({ name: "usd", rate: 1 });
  // todo: read currency from localstorage
  const fetchTitle = async (id: string) => {
    try {
      const resp = await fetch(`/api/events/price/${id}`);
      const data = await resp.json();

      return data;
    } catch (error) {
      console.log(error);
    }
  };
  // TODO: trace and react to changes in local storage API

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

    if (cart && JSON.parse(cart) !== storage) {
      let cartItems = JSON.parse(cart);
      setStorage(cartItems);
    } else {
      setStorage([]);
      setIsLoadingEvents(false);
    }
  }, [isOpen]);
  useEffect(() => {
    if (storage !== undefined) {
      (async () => {
        let fetchedItems = await Promise.all(
          storage.map((i: { id: string }) => fetchTitle(i.id))
        );
        if (fetchedItems.length > 0) {
          setEventItems(fetchedItems);
          setIsLoadingEvents(false);
        }
      })();
    }
  }, [storage]);
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
                  {isLoadingEvents ? (
                    <h3>Loading ...</h3>
                  ) : (
                    <>
                      {eventItems.length > 0 && storage.length !== 0 ? (
                        eventItems.map((i, index) => (
                          <CartEventItem
                            closeFn={(e) => setIsOpen(false)}
                            id={i.id}
                            key={index}
                            title={i.title}
                            amount={storage[index].amount}
                            price={i.price}
                            currency={currency}
                            delFn={() => {
                              setEventItems((prev) => [
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

                {!isLoadingEvents && eventItems.length > 0 ? (
                  <div className="flex justify-end">
                    <div className=" ring-4 ring-primary p-2 text-xl font-bold">
                      <span className="mr-1">Total :</span>
                      <span className="mr-1">
                        {eventItems.reduce((acc, val, index) => {
                          acc = acc + (val.price * currency.rate)* storage[index].amount;
                          return parseFloat(acc.toFixed(2));
                        }, 0)}
                      </span>
                      <span>{currency.name.toLocaleUpperCase()}</span>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {eventItems.length > 0 ? (
                  <div className="flex items-center justify-center h-full pt-10">
                    <Button title="Continue" text="Continue" fn={(e) => setIsOpen(false)} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full pt-10">
                    <Button title="Close" text="Close" fn={(e) => setIsOpen(false)} />
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
