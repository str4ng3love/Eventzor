"use client";
import Button from "../Button";
import { Fragment, useState, useReducer } from "react";
import { Transition, Dialog } from "@headlessui/react";
import Notification from "../../static/Notification";




enum FormActionKind {
  INPUT_ITEM,
  INPUT_DESC,
  INPUT_AMOUNT,
  INPUT_IS_PREORDER,
  INPUT_RELEASE,
  INPUT_PRICE,
  INPUT_IMAGE,
  DELETE_IMAGE,
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
  releaseDate?: Date | null;
  price: number;
  image: string[];
}

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
    case FormActionKind.INPUT_IS_PREORDER: {
      return {
        ...state,
        isPreorder: payload as boolean,
      };
    }
    case FormActionKind.INPUT_RELEASE: {
      return {
        ...state,
        releaseDate: payload as Date,
      };
    }
    case FormActionKind.INPUT_PRICE: {
      return {
        ...state,

        price: payload as number,
      };
    }
    case FormActionKind.INPUT_IMAGE: {
      return {
        ...state,

        image: [...state.image, payload as string],
      };
    }
    case FormActionKind.DELETE_IMAGE: {
      return {
        ...state,

        image: [
          ...state.image.filter(
            (image, index) => index !== (payload as number)
          ),
        ],
      };
    }

    default:
      return state;
  }
};
interface Props {
  optimisticFn: (e: React.MouseEvent) => void;
  optimisticFnClnUp: () => void;
  refetchTrigger: () => void;
}
const date = new Date();

const AddNewItem = ({
  optimisticFn,
  optimisticFnClnUp,
  refetchTrigger,
}: Props) => {
  const [show, setShow] = useState(false);
  const [canPost, setCanPost] = useState(true);
  const [image, setImage] = useState("");
  const [notify, setNotify] = useState({
    show: false,
    error: false,
    message: "",
  });
  const [state, dispatch] = useReducer(reducer, {
    item: "",
    description: "",
    amount: 1,

    isPreorder: false,
    releaseDate: null,
    price: 0,
    image: [],
  });
  const checkIfImageExists = async (url: string) => {
    try {
      const resp = await fetch(url, { method: "HEAD" })
      const contentType = resp.headers.get("content-type")

      if (contentType?.includes('image')) {
        return true
      } else {
        setNotify({ error: true, message: "Provided URL does not point to a valid image resource", show: true })
        return false
      }
    } catch (error) {
      setNotify({ error: true, message: "Provided URL does not point to a valid image resource", show: true })
      console.log(error)
      return false
    }
  }
  const handleCreate = async (state: InputState) => {
    if (state.amount < 0) {
      return setNotify({
        error: true,
        show: true,
        message: "Amount of items cannot be negative.",
      });
    }

    if (state.price.toString().includes(",")) {
      let priceWithDot = state.price.toString().replace(",", ".");
      dispatch({
        type: FormActionKind.INPUT_PRICE,
        payload: parseFloat(priceWithDot),
      });
    }
    if (
      state.isPreorder &&
      state.releaseDate &&
      state.releaseDate > new Date(date.setDate(date.getDay() + 1))
    ) {
      return setNotify({
        error: true,
        show: true,
        message: "Release date must be in future.",
      });
    }

    try {
      setCanPost(false);
      const resp = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ ...state }),
      });
      const dat = await resp.json();

      setCanPost(true);
      if (dat.error) {
        optimisticFnClnUp();
        setNotify({ error: true, show: true, message: dat.error });
      } else {
        refetchTrigger();
        setNotify({ error: false, show: true, message: dat.message });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Button
        title="Create new Item"
        text="Create Item"
        fn={() => setShow(true)}
      />
      <Transition appear show={show} as={Fragment}>
        <Dialog as="div" onClose={() => setShow(false)}>
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
                  "relative p-8 bg-bg_interactive text-text dark:bg-bg_interactive max-h-[85%] md:w-[30rem] shadow-md shadow-black overflow-y-scroll"
                }
              >
                <Dialog.Title className={"p-2 font-bold text-xl text-center"}>
                  Add new Item
                </Dialog.Title>
                <Dialog.Description className={"p-8 text-lg font-semibold"}>
                  Create new Item
                </Dialog.Description>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="p-4 flex justify-between z-20 ">
                    <label className="p-1 min-w-[10ch] mr-2">Item</label>
                    <input
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
                  <div className="flex p-4 flex-col justify-center items-center">
                    <div className="pb-8 flex justify-between w-full ">
                      <label className="p-1 min-w-[10ch] mr-2">
                        Image URL
                      </label>
                      <input
                        className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.currentTarget.value)}
                        onPaste={(e) => setImage(e.currentTarget.value)}
                      />
                    </div>
                    <Button
                      title="add picture"
                      text="add"
                      fn={async () => {
                        if (image.length === 0) return;
                        if (await checkIfImageExists(image)) {

                          dispatch({
                            type: FormActionKind.INPUT_IMAGE,
                            payload: image,
                          });
                          setImage("");
                        }
                      }}

                    />
                  </div>
                  <div className="flex gap-1">
                    {state.image && state.image.length > 0 ? (
                      state.image.map((i, index) => (
                        <span
                          key={index}
                          className="flex items-center relative after:flex after:items-center after:justify-center hover:after:content-['Delete'] hover:after:absolute after:top-0 after:left-0 after:bg-black/50 w-fit h-fit after:w-full after:h-full"
                          onClick={() =>
                            dispatch({
                              type: FormActionKind.DELETE_IMAGE,
                              payload: index,
                            })
                          }
                        >
                          <img
                            alt="image"
                            style={{ fontSize: "0px" }}
                            src={i}
                            width={100}
                            height={100}
                          />
                        </span>
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="p-4 mt-4 flex justify-evenly ">
                    <Button
                      title="Cancel adding new item"
                      text="Cancel"
                      bgColor="bg-secondary"
                      fn={() => setShow(false)}
                    />
                    {canPost ? (
                      <Button
                        title="Create"
                        text="Create"
                        fn={(e) => {
                          optimisticFn(e);
                          handleCreate(state);
                        }}
                      />
                    ) : (
                      <Button
                        title="Working..."
                        text="Adding..."
                        interactive={false}
                        bgColor="bg-bg"
                        fn={(e) => { }}
                      />
                    )}
                  </div>
                </form>
              </Dialog.Panel>
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

export default AddNewItem;
