"use client";
import Notification from "../../static/Notification";
import { useState, Fragment, useReducer } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../Button";

// Can't import enum type from schema.prisma file for some reason
enum Status {
  active,
  inactive,
  paused,
  canceled,
}

enum FormActionKind {
  INPUT_TITLE = "Input event title",
  INPUT_DESC = "Input event description",
  INPUT_TICKETS = "Input amount of available tickets",
  INPUT_LOCATION = "Location at which the event will take place",
  INPUT_STATUS = "Status of the event",
  INPUT_ESTART = "Events starting time",
  INPUT_EEND = "Events ending time",
}
interface InputAction {
  type: FormActionKind;
  payload: string | number | Status | Date;
}
interface InputState {
  title: string;
  description: string;
  tickets: number;
  startDate: number;
  endDate: number;
  location: string;
  status: Status;
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
        startDate: payload as number,
      };
    }
    case FormActionKind.INPUT_EEND: {
      return {
        ...state,
        endDate: payload as number,
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
    default:
      return state;
  }
};

const AddNewEvent = () => {
  const [show, setShow] = useState(false);
  const [notify, setNotify] = useState({
    show: false,
    message: "",
    error: false,
  });
  const [state, dispatch] = useReducer(reducer, {
    title: "",
    description: "",
    status: Status.active,
    tickets: 0,
    location: "",
    startDate: 0,
    endDate: 0,
  });

  const handleCreate = async (state: InputState) => {
    if (state.tickets < 0) {
      return setNotify({
        error: true,
        show: true,
        message: "Amount of tickets cannot be negative.",
      });
    }
    if(state.endDate < state.startDate){
      return setNotify({
        error: true,
        show: true,
        message: "Event cannot end before it has started.",
      });
    }
    try {
      const resp = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "Applicatin/json",
        },
        body: JSON.stringify(state),
      });
      const dat = await resp.json();
      console.log(dat);
      if (dat.error) {
        setNotify({ error: true, show: true, message: dat.error });
      } else {
        setNotify({ error: false, show: true, message: dat.message });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Button text="Edd Event" fn={() => setShow(true)} />
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
                  "relative p-8 bg-bg_interactive text-text dark:bg-bg_interactive  w-[30rem] shadow-md shadow-black overflow-y-scroll"
                }
              >
                <Dialog.Title className={"p-2 font-bold text-xl text-center"}>
                  Add new Event
                </Dialog.Title>
                <Dialog.Description className={"p-8 text-lg font-semibold"}>
                  Create new Event
                </Dialog.Description>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="p-4 flex justify-between z-20 ">
                    <label className="p-1 min-w-[10ch] mr-2">Title</label>
                    <input
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_TITLE,
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
                  </div>

                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">
                      Event Starts
                    </label>
                    <input
                      min={new Date().toISOString().slice(0, -8)}
                      onChange={(e) => {
                        dispatch({
                          type: FormActionKind.INPUT_ESTART,
                          payload: e.currentTarget.value,
                        });
                        console.log(e.currentTarget.value);
                      }}
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                      type="datetime-local"
                    />
                  </div>
                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">Event Ends</label>
                    <input
                      min={
                        state.startDate
                          ? new Date(state.startDate).toISOString().slice(0, -8)
                          : new Date().toISOString().slice(0, -8)
                      }
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_EEND,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                      type="datetime-local"
                    />
                  </div>
                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">Location</label>
                    <input
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_LOCATION,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                      type="text"
                    />
                  </div>
                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">
                      Available tickets
                    </label>
                    <input
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_TICKETS,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                      type="number"
                      min={0}
                    />
                  </div>
                  <Notification
                    message={notify.message}
                    show={notify.show}
                    error={notify.error}
                    onAnimEnd={() =>
                      setNotify({ error: false, message: "", show: false })
                    }
                  />
                  <div className="p-4 mt-4 flex justify-evenly ">
                    <Button
                      text="Create"
                      fn={() => {
                        handleCreate(state);
                      }}
                    />
                    <Button text="Cancel" fn={() => setShow(false)} />
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AddNewEvent;
