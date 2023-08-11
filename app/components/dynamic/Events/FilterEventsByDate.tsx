"use client";
import { BsCalendar3EventFill } from "react-icons/bs";
import { Dialog, Transition } from "@headlessui/react";
import Notification from "../../static/Notification";
import React, { useState, Fragment } from "react";
import ButtonWithIcon from "../ButtonWithIcon";
import Button from "../Button";

interface Props {
  fn:(e:React.MouseEvent, dates:{ startDate: string, endDate: string}) => void;
  title:string;
}

const FilterEventsByDate = ({fn, title}:Props) => {
  const [show, setShow] = useState(false);
  const [dates, setDates] = useState({ startDate: new Date().toISOString().slice(0, -8), endDate: new Date().toISOString().slice(0, -8) });
  const [notify, setNotify] = useState({
    show: false,
    message: "",
    error: false,
  });

  return (
    <div  className="relative" >
      <span title={title} onClick={()=>setShow(true)}><ButtonWithIcon Icon={BsCalendar3EventFill} size="1.5em"/></span>
  
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
                  "relative p-8 bg-bg_interactive text-text dark:bg-bg_interactive  w-[30rem] shadow-md shadow-black"
                }
              >
                <Dialog.Title className={"p-2 font-bold text-xl text-center"}>
                  Filter Events by Date
                </Dialog.Title>
                <form onSubmit={(e) => e.preventDefault()} >
                  <div className="p-4 flex flex-col items-center justify-center ">
                    <div className="p-4 flex justify-between ">
                      <label className="p-1 min-w-[10ch] mr-2">
                        From
                      </label>
                      <input
                  
                        value={dates.startDate}
                        onChange={(e) =>{
                          let target = e.currentTarget.value
                          if(!target) return null
                          setDates((prev) => {
                            return {
                              ...prev,
                              startDate: target,
                            };})
                        }
                        }
                        className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                        type="datetime-local"
                      />
                    </div>
                    <div className="p-4 flex justify-between ">
                      <label className="p-1 min-w-[10ch] mr-2">
                        To
                      </label>
                      <input
                      value={dates.endDate}
                        min={
                          dates.startDate
                            ? new Date(dates.startDate)
                                .toISOString()
                                .slice(0, -8)
                            : new Date().toISOString().slice(0, -8)
                        }
                        onChange={(e) =>{
                          let target = e.currentTarget.value
                          if(!target) return null
                          setDates((prev) => {
                            return {
                              ...prev,
                              endDate: target,
                            };})
                        }}
                        className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
                        type="datetime-local"
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
                    <div className="p-4 mt-4 flex justify-evenly w-full ">
                    <Button
                      text="filter"
                      fn={(e) => {
                        if(dates.endDate < dates.startDate){
                          setNotify({error:true, show:true, message:"Invalid Parametes, Second Field Should Container Later Date"})
                        } else {
                          fn(e, dates)
                        }
                      }}
                    />
                    <Button text="Cancel" fn={() => setShow(false)} />
                    </div>
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

export default FilterEventsByDate;
