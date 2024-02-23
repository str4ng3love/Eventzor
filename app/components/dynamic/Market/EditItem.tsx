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
  releaseDate?: Date | string | null;
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
        releaseDate: payload as Date | string,
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
    releaseDate: props.releaseDate
      ? new Date(props.releaseDate).toISOString().slice(0, -8)
      : null,
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
            <div className="fixed inset-0 bg-black/20" aria-hidden />
            <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm">
              <Dialog.Panel
                className={
                  "bg-bg_interactive dark:bg-bg_interactive relative w-[30rem] overflow-y-scroll  p-8 text-text shadow-md shadow-black"
                }
              >
                <Dialog.Title className={"p-2 text-center text-xl font-bold"}>
                  Edit Item
                </Dialog.Title>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="z-20 flex justify-between p-4 ">
                    <label className="mr-2 min-w-[10ch] p-1">Item</label>
                    <input
                      value={state.item}
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_ITEM,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="dark:text-interactive_text h-8 w-full min-w-[15ch] p-1 ring-1 ring-text  active:ring-link"
                      type="text"
                    />
                  </div>
                  <div className="flex justify-between p-4 ">
                    <label className="mr-2 min-w-[10ch] p-1 ">
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
                      className="dark:text-interactive_text h-24 w-full min-w-[15ch] resize-none p-1 ring-1  ring-text active:ring-link "
                    />
                  </div>{" "}
                  <div className="flex justify-between p-4 ">
                    <label className="mr-2 min-w-[10ch] p-1">Type</label>
                    <div>
                      <Listbox value={selected} onChange={setSelected}>
                        <Listbox.Button
                          className={`bg-bg_interactive relative w-fit min-w-[10ch] p-2 ring-2 ring-primary transition-all duration-300 hover:bg-link`}
                        >
                          {selected}
                        </Listbox.Button>
                        <Listbox.Options
                          className={`absolute flex flex-col bg-primary ring-2 ring-primary`}
                        >
                          {options.map((o, index) => (
                            <Listbox.Option
                              onClick={(e) => setSelected(o)}
                              key={index}
                              className={`p-2 transition-all duration-300 hover:bg-link`}
                              value={o}
                            >
                              {o}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Listbox>
                    </div>
                  </div>
                  <div className="flex justify-between p-4 ">
                    <label className="mr-2 min-w-[10ch] p-1">Price</label>
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
                      className="dark:text-interactive_text h-8 w-full min-w-[15ch] p-1 ring-1 ring-text  active:ring-link"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div className="flex justify-between p-4 ">
                    <label className="mr-2 min-w-[10ch] p-1">Amount</label>
                    <input
                      value={state.amount}
                      min={1}
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_AMOUNT,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="dark:text-interactive_text h-8 w-full min-w-[15ch] p-1 ring-1 ring-text  active:ring-link"
                      type="number"
                    />
                  </div>
                  <div className="flex justify-between p-4 ">
                    <label className="mr-2 min-w-[10ch] p-1">Preorder ?</label>
                    <input
                      checked={state.isPreorder}
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_IS_PREORDER,
                          payload: !state.isPreorder,
                        })
                      }
                      className="dark:text-interactive_text  w-full p-1 ring-1 ring-text active:ring-link  "
                      type="checkbox"
                    />
                  </div>
                  {state.isPreorder ? (
                    <div className="flex justify-between p-4 ">
                      <label className="mr-2 min-w-[10ch] p-1">
                        Release date
                      </label>
                      <input
                        value={
                          state.releaseDate
                            ? (state.releaseDate as string)
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
                        className="dark:text-interactive_text h-8 w-full min-w-[15ch] p-1 ring-1 ring-text  active:ring-link"
                        type="datetime-local"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="flex justify-center p-4 ">
                    <EditImages
                      type={CallType.item}
                      triggerRefetch={props.triggerFetchFn}
                      images={props.images}
                      id={props.id}
                    />
                  </div>
                  <div className="mt-4 flex justify-evenly p-4 ">
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
