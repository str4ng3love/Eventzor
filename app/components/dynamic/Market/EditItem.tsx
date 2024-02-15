"use client";
import Notification from "../../static/Notification";
import React, { useState, Fragment, useReducer, useEffect } from "react";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import Button from "../Button";
import EditImages, { CallType } from "../EditImages";

type ItemType = "tshirt" | "cap" | "poster" | "bracelet" | "sticker";
let options: ItemType[] = ["bracelet", "cap", "poster", "sticker", "tshirt"];
enum FormActionKind {
  INPUT_ITEM,
  INPUT_DESC,
  INPUT_AMOUNT,
  INPUT_IS_PREORDER,
  INPUT_TYPE,
  INPUT_RELEASE,
  INPUT_PRICE,
}

interface InputAction {
  type: FormActionKind;
  payload: string | number | boolean | Date;
}
interface InputState {
  item: string;
  description: string;
  amount: number;
  isPreorder: boolean;
  type: string;
  releaseDate?: Date |string | null;
  price: number;
}
const date = new Date();
const reducer = (state: InputState, action: InputAction) => {
  const { type, payload } = action;

  switch (type) {
    case FormActionKind.INPUT_ITEM: {
      return {
        ...state,
        item: payload as string,
      };
    }
    case FormActionKind.INPUT_DESC: {
      return {
        ...state,
        description: payload as string,
      };
    }
    case FormActionKind.INPUT_AMOUNT: {
      return {
        ...state,
        amount: payload as number,
      };
    }
    case FormActionKind.INPUT_TYPE: {
      return {
        ...state,
        type: payload as string,
      };
    }
    case FormActionKind.INPUT_IS_PREORDER: {
      return {
        ...state,
        isPreorder: payload as boolean,
      };
    }
    case FormActionKind.INPUT_RELEASE: {
      console.log(payload);
      return {
        ...state,
        releaseDate: payload as Date|string,
      };
    }
    case FormActionKind.INPUT_PRICE: {
      return {
        ...state,

        price: payload as number,
      };
    }

    default:
      return state;
  }
};

interface Props extends InputState {
  id: string;
  show: boolean;
  images: string[];
  stopDisplayingFn: () => void;
  triggerFetchFn: () => void;
}
const EditItem = ({ ...props }: Props) => {
  const [selected, setSelected] = useState(props.type);
  const [canEdit, setCanEdit] = useState(true);
  const [notify, setNotify] = useState({
    show: false,
    error: false,
    message: "",
  });
  const [state, dispatch] = useReducer(reducer, {
    item: props.item,
    description: props.description,
    amount: props.amount,
    type: props.type,
    isPreorder: props.isPreorder,
    releaseDate: props.releaseDate ? new Date(props.releaseDate).toISOString().slice(0,-8) : null,
    price: props.price,
  });

  const handleEdit = async (state: InputState) => {
    try {
      const resp = await fetch("/api/items", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...state, id: props.id }),
      });
      const dat = await resp.json();
      setCanEdit(true);
      props.triggerFetchFn();

      if (dat.error) {
        setNotify({ error: true, show: true, message: dat.error });
      } else {
        // revalidation
        // const resp = await fetch('/api/revalidate?'+ new URLSearchParams({path:'/dashboard/market'}), {method:"POST"})
        // const message = await resp.json()
        // console.log(message)
        setNotify({ error: false, show: true, message: dat.message });
      }
    } catch (error) {
      setCanEdit(true);
      setNotify({ error: false, show: true, message: "Something went wrong" });
      console.log(error);
    }
  };

  return (
    <div>
      <Transition appear show={props.show} as={Fragment}>
        <Dialog as="div" onClose={() => props.stopDisplayingFn()}>
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="bg-black/20 fixed inset-0" aria-hidden />
            <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm">
              <Dialog.Panel
                className={
                  "relative p-8 bg-bg_interactive text-text dark:bg-bg_interactive  w-[30rem] shadow-md shadow-black overflow-y-scroll"
                }
              >
                <Dialog.Title className={"p-2 font-bold text-xl text-center"}>
                  Edit Item
                </Dialog.Title>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="p-4 flex justify-between z-20 ">
                    <label className="p-1 min-w-[10ch] mr-2">Item</label>
                    <input
                      value={state.item}
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_ITEM,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                      type="text"
                    />
                  </div>
                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2 ">
                      Description
                    </label>
                    <textarea
                      value={state.description}
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_DESC,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-24 resize-none "
                    />
                  </div>{" "}
                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">Type</label>
                    <div>
                      <Listbox value={selected} onChange={setSelected}>
                        <Listbox.Button
                          className={`p-2 relative bg-bg_interactive ring-2 ring-primary w-fit hover:bg-link transition-all duration-300 min-w-[10ch]`}
                        >
                          {selected}
                        </Listbox.Button>
                        <Listbox.Options
                          className={`flex flex-col absolute bg-primary ring-2 ring-primary`}
                        >
                          {options.map((o, index) => (
                            <Listbox.Option
                              onClick={(e) => setSelected(o)}
                              key={index}
                              className={`hover:bg-link p-2 transition-all duration-300`}
                              value={o}
                            >
                              {o}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Listbox>
                    </div>
                  </div>
                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">Price</label>
                    <input
                      onInvalid={() =>
                        setNotify({
                          error: true,
                          show: true,
                          message: `Please provide a number, use a dot(.) when dealing with fractions `,
                        })
                      }
                      value={state.price}
                      min={0}
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_PRICE,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">Amount</label>
                    <input
                      value={state.amount}
                      min={1}
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_AMOUNT,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                      type="number"
                    />
                  </div>
                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">Preorder ?</label>
                    <input
                      checked={state.isPreorder}
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_IS_PREORDER,
                          payload: !state.isPreorder,
                        })
                      }
                      className="p-1  ring-1 ring-text active:ring-link dark:text-interactive_text w-full  "
                      type="checkbox"
                    />
                  </div>
                  {state.isPreorder ? (
                    <div className="p-4 flex justify-between ">
                      <label className="p-1 min-w-[10ch] mr-2">
                        Release date
                      </label>
                      <input
                        value={
                          state.releaseDate
                            ?  state.releaseDate as string
                            : new Date(date.setDate(date.getDate() + 1))
                                .toISOString()
                                .slice(0, -8)
                        }
                        min={new Date(date.setDate(date.getDate() + 1))
                          .toISOString()
                          .slice(0, -8)}
                        onInvalid={() => {
                          setNotify({
                            error: true,
                            show: true,
                            message: "Please provide a valid date",
                          });
                        }}
                        onChange={(e) =>
                          dispatch({
                            type: FormActionKind.INPUT_RELEASE,
                            payload: e.currentTarget.value,
                          })
                        }
                        className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                        type="datetime-local"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="p-4 flex justify-center ">
                    <EditImages
                      type={CallType.item}
                      triggerRefetch={props.triggerFetchFn}
                      images={props.images}
                      id={props.id}
                    />
                  </div>
                  <div className="p-4 mt-4 flex justify-evenly ">
                    {canEdit ? (
                      <Button
                        title="Save"
                        text="Save"
                        fn={() => {
                          setCanEdit(false);
                          handleEdit(state);
                        }}
                      />
                    ) : (
                      <Button
                        title="Saving ..."
                        text="Saving..."
                        interactive={false}
                        bgColor={"bg-bg"}
                        fn={() => {}}
                      />
                    )}
                    <Button
                      title="Cancel"
                      text="Cancel"
                      fn={() => props.stopDisplayingFn()}
                    />
                  </div>
                </form>
              </Dialog.Panel>
              s
              <Notification
                message={notify.message}
                show={notify.show}
                error={notify.error}
                onAnimEnd={() =>
                  setNotify({ error: false, message: "", show: false })
                }
              />
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
};

export default EditItem;
