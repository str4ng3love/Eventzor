"use client";
import Notification from "../../static/Notification";
import React, { useState, Fragment, useReducer } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../Button";
import EditImages, { CallType } from "../EditImages";
import { StatusEvent } from "@prisma/client";
// // Can't import enum type from schema.prisma file for some reason
//  enum Status {
//   active="active",
//   inactive ="inactive",
//   paused="paused",
//   canceled="canceled",
// }

 enum FormActionKind {
  INPUT_TITLE = "Input event title",
  INPUT_DESC = "Input event description",
  INPUT_TICKETS = "Input amount of available tickets",
  INPUT_LOCATION = "Location at which the event will take place",
  INPUT_ECLOSING = "Events closing date",
  INPUT_ESTART = "Events starting date",
  INPUT_STATUS = "Status of the event",
  INPUT_PRICE = "Ticket price",
}
 interface InputAction {
  type: FormActionKind;
  payload: string | number | StatusEvent | Date;
}
 export interface InputState {
  title: string;
  description: string;
  tickets: number;
  eventDate: Date;
  closingDate: Date;
  price: number;
  location: string;
  status: StatusEvent | any;
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
    default:
      return state;
  }
};
interface Props extends InputState{
    show: boolean,
    id: string;
    images:string[];
    stopDisplayingFn: () => void;
    triggerFetchFn: ()=>void;
}
const EditEvent = ({...props}:Props) => {

  const [canEdit, setCanEdit] = useState(true)
  const [notify, setNotify] = useState({
    show: false,
    message: "",
    error: false,
  });
  const closingDate = new Date()
  const eventDate = new Date()
  closingDate.setUTCMonth(closingDate.getUTCMonth() + 1)
  eventDate.setUTCMonth(eventDate.getUTCMonth() + 3)
  const [state, dispatch] = useReducer(reducer, {
    title: props.title,
    description: props.description,
    status: props.status,
    tickets: props.tickets,
    location: props.location,
    closingDate: props.closingDate,
    eventDate: props.eventDate,
    price: props.price
  });

  const handleEdit = async (state: InputState) => {
    if (state.tickets < 0) {
      return setNotify({
        error: true,
        show: true,
        message: "Amount of tickets cannot be negative.",
      });
    }
    if(state.eventDate < state.closingDate){
      return setNotify({
        error: true,
        show: true,
        message: "Cannot start the event before it's closed.",
      });
    }
    try {
      const resp = await fetch("/api/events", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...state, id: props.id})
      });
      const dat = await resp.json();
      setCanEdit(true)
      props.triggerFetchFn()
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
                  Edit Event
                </Dialog.Title>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="p-4 flex justify-between z-20 ">
                    <label className="p-1 min-w-[10ch] mr-2">Title</label>
                    <input
                    value={state.title}
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
                    value={state.description}
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
                    <label className="p-1 min-w-[10ch] mr-2">Closing Date</label>
                    <input
                      value={new Date(state.closingDate).toISOString().slice(0,-8)}
                      min={new Date().toISOString().slice(0,-8)}
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_ECLOSING,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                      type="datetime-local"
                    />
                  </div>

                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">
                      Event Date
                    </label>
                    <input
                    value={new Date(state.eventDate).toISOString().slice(0,-8)}
                    min={new Date().toISOString().slice(0,-8)}
                      onChange={(e) => {
                        dispatch({
                          type: FormActionKind.INPUT_ESTART,
                          payload: e.currentTarget.value,
                        });
                      }}
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                      type="datetime-local"
                    />
                  </div>
                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">Location</label>
                    <input
                    value={state.location}
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
                    value={state.tickets}
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
                  <div className="p-4 flex justify-between ">
                    <label className="p-1 min-w-[10ch] mr-2">
                      Ticket Price
                    </label>
                    <input
                      onChange={(e) =>
                        dispatch({
                          type: FormActionKind.INPUT_PRICE,
                          payload: e.currentTarget.value,
                        })
                      }
                      className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                      type="number"
                      step="0.01"
                      value={state.price}
                    />
                  </div>
                  <div className="p-4 flex justify-center ">
                        <EditImages type={CallType.event} triggerRefetch={()=>props.triggerFetchFn()} images={props.images} id={props.id}/>
                  </div>
                
                  <div className="p-4 mt-4 flex justify-evenly ">
                    {canEdit ?  <Button
                    title="Save"
                      text="Save"
                      fn={() => {
                        setCanEdit(false)
                        handleEdit(state);
                      }}
                    />:  <Button
                    title="Saving ..."
                    text="Saving..."
                    interactive={false}
                    bgColor={"bg-bg"}
                    fn={() => {
                   
                    }}
                  />}
                   
                    <Button title="Cancel" text="Cancel" fn={() => props.stopDisplayingFn()} />
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

export default EditEvent;
