"use client";
import Notification from "../../static/Notification";
import { useState, Fragment, useReducer } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../Button";
import Image from "next/image";

enum FormActionKind {
  INPUT_TITLE = "Input event title",
  INPUT_DESC = "Input event description",
  INPUT_TICKETS = "Input amount of available tickets",
  INPUT_LOCATION = "Location at which the event will take place",
  INPUT_ECLOSING = "Events closing date",
  INPUT_ESTART = "Events starting date",
  INPUT_PRICE = "Ticket price",
  INPUT_IMAGE = "Image for promotion",
  DELETE_IMAGE = "Delete a image",
}
interface InputAction {
  type: FormActionKind;
  payload: string | number | Date;
}
interface InputState {
  title: string;
  description: string;
  tickets: number;
  eventDate: Date;
  closingDate: Date;
  location: string;
  price: number;
  image: string[];
}

const reducer = (state: InputState, action: InputAction) => {
  const { type, payload } = action;

  switch (type) {
    case FormActionKind.INPUT_TITLE: {
      return {
        ...state,
        title: payload as string,
      };
    }
    case FormActionKind.INPUT_DESC: {
      return {
        ...state,
        description: payload as string,
      };
    }
    case FormActionKind.INPUT_ESTART: {
      return {
        ...state,
        eventDate: payload as Date,
      };
    }
    case FormActionKind.INPUT_ECLOSING: {
      return {
        ...state,
        closingDate: payload as Date,
      };
    }
    case FormActionKind.INPUT_PRICE: {
      return {
        ...state,
        price: payload as number,
      };
    }
    case FormActionKind.INPUT_LOCATION: {
      return {
        ...state,
        location: payload as string,
      };
    }
    case FormActionKind.INPUT_TICKETS: {
      return {
        ...state,
        tickets: payload as number,
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
            (image, index) => index !== (payload as number),
          ),
        ],
      };
    }
    default:
      return state;
  }
};
interface Props {
  refetchTrigger: () => void;
  optimisticFn: (e: React.MouseEvent) => void;
  optimisticFnClnUp: () => void;
}
const AddNewEvent = ({
  optimisticFn,
  optimisticFnClnUp,
  refetchTrigger,
}: Props) => {
  const [show, setShow] = useState(false);
  const [canPost, setCanPost] = useState(true);
  const [image, setImage] = useState("");
  const [notify, setNotify] = useState({
    show: false,
    message: "",
    error: false,
  });
  const closingDate = new Date();
  const eventDate = new Date();
  closingDate.setUTCMonth(closingDate.getUTCMonth() + 1);
  eventDate.setUTCMonth(eventDate.getUTCMonth() + 3);
  const [state, dispatch] = useReducer(reducer, {
    title: "",
    description: "",
    tickets: 0,
    location: "",
    closingDate: closingDate,
    eventDate: eventDate,
    price: 0,
    image: [],
  });
  const checkIfImageExists = async (url: string) => {
    try {
      const resp = await fetch(url, { method: "HEAD" });
      const contentType = resp.headers.get("content-type");

      if (contentType?.includes("image")) {
        return true;
      } else {
        setNotify({
          error: true,
          message: "Provided URL does not point to a valid image resource",
          show: true,
        });
        return false;
      }
    } catch (error) {
      setNotify({
        error: true,
        message: "Provided URL does not point to a valid image resource",
        show: true,
      });
      console.log(error);
      return false;
    }
  };
  const handleCreate = async (state: InputState) => {
    if (state.tickets < 0) {
      return setNotify({
        error: true,
        show: true,
        message: "Amount of tickets cannot be negative.",
      });
    }
    if (state.eventDate < state.closingDate) {
      return setNotify({
        error: true,
        show: true,
        message: "Cannot start the event before it's closed.",
      });
    }

    try {
      setCanPost(false);
      const resp = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(state),
      });
      const data = await resp.json();

      setCanPost(true);
      if (data.error) {
        setNotify({ error: true, show: true, message: data.error });
        optimisticFnClnUp();
      } else {
        setNotify({ error: false, show: true, message: data.message });
        refetchTrigger();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button title="add an event" text="Add Event" fn={() => setShow(true)} />
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
            <div className="fixed inset-0 bg-black/20" aria-hidden />
            <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm">
              <Dialog.Panel
                className={
                  "dark:bg-bg_interactive relative max-h-[85%] overflow-y-scroll bg-interactive p-8 text-text shadow-md shadow-black dark:bg-sidebar md:w-[50%]"
                }
              >
                <Dialog.Title className={"p-2 text-center text-xl font-bold"}>
                  Add new Event
                </Dialog.Title>
                <Dialog.Description className={"p-8 text-lg font-semibold"}>
                  Create new Event
                </Dialog.Description>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="z-20 flex justify-between p-4 ">
                    <label className="mr-2 min-w-[10ch] p-1">Title</label>
                    <input
                      min={new Date().toDateString().slice(0, -8)}
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_TITLE,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="dark:text-interactive_text h-8 w-full min-w-[15ch] p-1 ring-1 ring-primary active:ring-link  dark:text-contrast"
                      type="text"
                    />
                  </div>
                  <div className="flex justify-between p-4 ">
                    <label className="mr-2 min-w-[10ch] p-1 ">
                      Description
                    </label>
                    <textarea
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_DESC,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="dark:text-interactive_text h-24 w-full min-w-[15ch] resize-none p-1 ring-1 ring-primary  active:ring-link dark:text-contrast "
                    />
                  </div>
                  <div className="flex justify-between p-4 ">
                    <label className="mr-2 min-w-[10ch] p-1">
                      Closing Date
                    </label>
                    <input
                      min={new Date().toISOString().slice(0, -8)}
                      defaultValue={closingDate.toISOString().slice(0, -8)}
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_ECLOSING,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="dark:text-interactive_text h-8 w-full min-w-[15ch] p-1 ring-1 ring-primary active:ring-link  dark:text-contrast"
                      type="datetime-local"
                    />
                  </div>

                  <div className="flex justify-between p-4 ">
                    <label className="mr-2 min-w-[10ch] p-1">Event Date</label>
                    <input
                      min={new Date().toISOString().slice(0, -8)}
                      defaultValue={new Date(eventDate)
                        .toISOString()
                        .slice(0, -8)}
                      onChange={(e) => {
                        dispatch({
                          type: FormActionKind.INPUT_ESTART,
                          payload: e.currentTarget.value,
                        });
                      }}
                      className="dark:text-interactive_text h-8 w-full min-w-[15ch] p-1 ring-1 ring-primary active:ring-link  dark:text-contrast"
                      type="datetime-local"
                    />
                  </div>
                  <div className="flex justify-between p-4 ">
                    <label className="mr-2 min-w-[10ch] p-1">Location</label>
                    <input
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_LOCATION,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="dark:text-interactive_text h-8 w-full min-w-[15ch] p-1 ring-1 ring-primary active:ring-link  dark:text-contrast"
                      type="text"
                    />
                  </div>
                  <div className="flex justify-between p-4 ">
                    <label className="mr-2 min-w-[10ch] p-1">
                      Available tickets
                    </label>
                    <input
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_TICKETS,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="dark:text-interactive_text h-8 w-full min-w-[15ch] p-1 ring-1 ring-primary active:ring-link  dark:text-contrast"
                      type="number"
                      defaultValue={0}
                      min={0}
                    />
                  </div>
                  <div className="flex justify-between p-4 ">
                    <label className="mr-2 min-w-[10ch] p-1">
                      Ticket Price
                    </label>
                    <input
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_PRICE,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="dark:text-interactive_text h-8 w-full min-w-[15ch] p-1 ring-1 ring-primary active:ring-link  dark:text-contrast"
                      type="number"
                      step="0.01"
                      defaultValue={0}
                      min={0}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="flex w-full justify-between pb-8 ">
                      <label className="mr-2 min-w-[10ch] p-1">Image URL</label>
                      <input
                        className="dark:text-interactive_text h-8 w-full min-w-[15ch] p-1 ring-1 ring-primary active:ring-link  dark:text-contrast"
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.currentTarget.value)}
                        onPaste={(e) => setImage(e.currentTarget.value)}
                      />
                    </div>
                    <Button
                      setW="w-[10ch]"
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
                          className="relative flex h-fit w-fit items-center after:left-0 after:top-0 after:flex after:h-full after:w-full after:items-center after:justify-center after:bg-black/50 hover:after:absolute hover:after:content-['Delete']"
                          onClick={() =>
                            dispatch({
                              type: FormActionKind.DELETE_IMAGE,
                              payload: index,
                            })
                          }
                        >
                          <Image
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
                  <div className="mt-4 flex justify-evenly p-4 ">
                    <Button
                      setW="w-[10ch]"
                      title="Cancel adding new event"
                      text="Cancel"
                      fn={() => setShow(false)}
                      bgColor="bg-secondary"
                    />
                    {canPost ? (
                      <Button
                        setW="w-[10ch]"
                        title="Create"
                        text="Create"
                        fn={(e) => {
                          optimisticFn(e);
                          handleCreate(state);
                        }}
                      />
                    ) : (
                      <Button
                        setW="w-[10ch]"
                        title="Working..."
                        text="Adding..."
                        interactive={false}
                        bgColor="bg-bg"
                        fn={(e) => {}}
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

export default AddNewEvent;
