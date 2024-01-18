"use client";

import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment, useEffect } from "react";
import { BiCart } from "react-icons/bi";
import CartButton from "./CartButton";
import Button from "../Button";
import Currency from "../Currency";
import CartItem from "./CartItem";
import ShippingForm, { ShippingMethod } from "./ShippingForm";
import Notification from "../../static/Notification";
import { useRouter } from "next/navigation";

export interface CartItemData {
  id: string;
  amount: number;
  type: string;
  price: number;
  item: string;
}
const ShoppingCart = () => {
  const router = useRouter()
  const [notify, setNotify] = useState({
    error: false,
    show: false,
    message: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [shippingData, setShipppingData] = useState<{
    method: ShippingMethod;
    phoneNumber?: number;
    address?: string;
  }>({ address: "", method: ShippingMethod.email, phoneNumber: undefined });
  const [total, setTotal] = useState<number>();
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [newEntries, setNewEntries] = useState(0);
  const [currency, setCurrency] = useState({ name: "usd", rate: 1 });
  const [showShipping, setShowShipping] = useState(false);
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

// TO DO: something is removing cookie from local storage -> fix it

  const clearCartAndComponent = () => {

    setIsWorking(false)
    setIsOpen(false)
    localStorage.removeItem('cart')
    window.dispatchEvent(new Event('storage'))
    router.push("/orders")
  }
  const createOrder = async () => {
    setIsWorking(true);
    try {
      const resp = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: { items: cartItems, currency: currency, shippingData },
        }),
      });
      const message = await resp.json();
      if (message.message) {
        clearCartAndComponent()
        router.push(`/lipps/${message.id}`)
      } else {
        setIsWorking(false);
        setNotify({
          show: true,
          error: true,
          message: message.error,
        });
      }
    } catch (error) {
      setIsWorking(false);
      console.log(error);
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
        let cartContent = JSON.parse(cart);

        setCartItems(cartContent);
        setNewEntries(cartContent.length);
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
      window.removeEventListener("storage", () => { });
      window.removeEventListener("currency", () => { });
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
                  {showShipping ? "Shipping Info" : "Shopping Cart"}
                </Dialog.Title>
                <Dialog.Description className={"text-sm font-semibold"}>
                  {showShipping ? "" : "Manage your Items"}
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
                      {showShipping ? (
                        <>
                          <ShippingForm
                            fn={(shippingData) => {
                              setShipppingData(shippingData);
                              setShowShipping(false);
                            }}
                            method={shippingData.method}
                            address={shippingData.address}
                            phone={shippingData.phoneNumber}
                          />
                        </>
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
                    </>
                  )}
                </div>
                {cartItems.length === 0 || showShipping ? (
                  <></>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <div className="flex flex-col w-full ">
                        <span className="p-1 text-lg">Shipping</span>
                        <div className="flex">
                          <span className="w-[16ch] p-1 first-letter:uppercase">
                            method&nbsp;:&nbsp;
                          </span>
                          <span className="p-1 first-letter:uppercase">
                            {shippingData?.method}
                          </span>
                        </div>
                        {shippingData?.method !== "Email" ? (
                          <>
                            <div className="flex">
                              <span className="w-[16ch] p-1 first-letter:uppercase">
                                mailing address&nbsp;:&nbsp;
                              </span>
                              <span className="p-1 first-letter:uppercase">
                                {shippingData?.address}
                              </span>
                            </div>
                            <div className="flex">
                              <span className="w-[16ch] p-1 first-letter:uppercase">
                                phone number&nbsp;:&nbsp;
                              </span>
                              <span className="p-1 first-letter:uppercase">
                                {shippingData?.phoneNumber}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="p-1 first-letter:uppercase mt-2 mr-2">
                              We&apos;ll use the email address provided at
                              registration.
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Button
                          title="Change shipping info"
                          text="Change"
                          fn={(e) => setShowShipping(true)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {!isLoadingItems && cartItems.length > 0 ? (
                  <>
                    {showShipping ? (
                      <></>
                    ) : (
                      <div className="flex justify-end">
                        <div className=" ring-4 ring-primary p-2 text-xl font-bold">
                          <span className="mr-1">Total :</span>
                          <span className="mr-1">{total}</span>
                          <span>{currency.name.toLocaleUpperCase()}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {cartItems.length > 0 ? (
                  <div className="flex items-center justify-end h-full pt-10 gap-2">

                    <>
                    <Button
                      title="Open Orders"
                      text="Open Orders"
                      link="/orders"
                      bgColor="bg-link self-start"
                      fn={(e) => setIsOpen(false)}
                    />
                      {showShipping ? (
                        <></>
                      ) : (
                        <>
                          <Button
                            title="Close"
                            text="Close"
                            fn={(e) => setIsOpen(false)}
                          />
                          <>
                            {isWorking ? (
                              <Button
                                title="Working..."
                                text="Working..."
                                fn={() => { }}
                                interactive={false}
                                bgColor="bg-bg"
                              />
                            ) : (
                              <Button
                                title="Continue"
                                text="Continue"
                                fn={() =>createOrder()}
                                
                              />
                            )}
                          </>
                        </>
                      )}
                    </>
                  </div>
                ) : (
                  <div className="flex items-center justify-end h-full pt-10 gap-2">
                    <Button
                      title="Open Orders"
                      text="Open Orders"
                      link="/orders"
                      fn={(e) => setIsOpen(false)}
                    />
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
      <>
        <Notification error={notify.error} message={notify.message} onAnimEnd={() => { setNotify({ error: false, show: false, message: '' }) }} show={notify.show} />
      </>
    </>
  );
};

export default ShoppingCart;
