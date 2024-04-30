"use client";
import { BsCalendar3EventFill } from "react-icons/bs";
import { Dialog, Transition } from "@headlessui/react";
import Notification from "../../static/Notification";
import React, { useState, Fragment } from "react";
import ButtonWithIcon from "../ButtonWithIcon";
import Button from "../Button";

interface Props {
  passDates?: (dates: { startDate: string; endDate: string }) => void;
  defaultDates?: {
    startDate: string;
    endDate: string;
  };
  fn: (
    e: React.MouseEvent,
    dates: { startDate: string; endDate: string },
  ) => void;
  title: string;
}

const FilterEventsByDate = ({ passDates, defaultDates, fn, title }: Props) => {
  const [show, setShow] = useState(false);
  const [dates, setDates] = useState({
    startDate: defaultDates
      ? defaultDates.startDate
      : new Date().toISOString().slice(0, -8),
    endDate: defaultDates
      ? defaultDates.endDate
      : new Date().toISOString().slice(0, -8),
  });
  const [notify, setNotify] = useState({
    show: false,
    message: "",
    error: false,
  });

  return (
    <div className="relative">
      <span title={title} onClick={() => setShow(true)}>
        <ButtonWithIcon Icon={BsCalendar3EventFill} size="1.5em" />
      </span>

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
                  "bg-bg_interactive relative w-[30rem] bg-interactive  p-8 text-text shadow-md shadow-black dark:bg-sidebar"
                }
              >
                <Dialog.Title className={"p-2 text-center text-xl font-bold"}>
                  Filter Events by Date
                </Dialog.Title>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-col items-center justify-center p-4 ">
                    <div className="flex justify-between p-4 ">
                      <label className="mr-2 min-w-[10ch] p-1">From</label>
                      <input
                        value={dates.startDate}
                        onChange={(e) => {
                          let target = e.currentTarget.value;
                          if (!target) return null;
                          setDates((prev) => {
                            return {
                              ...prev,
                              startDate: target,
                            };
                          });
                        }}
                        className="h-8 w-full min-w-[15ch] p-1 ring-1 ring-text active:ring-link dark:text-contrast"
                        type="datetime-local"
                      />
                    </div>
                    <div className="flex justify-between p-4 ">
                      <label className="mr-2 min-w-[10ch] p-1">To</label>
                      <input
                        value={dates.endDate}
                        min={
                          dates.startDate
                            ? new Date(dates.startDate)
                                .toISOString()
                                .slice(0, -8)
                            : new Date().toISOString().slice(0, -8)
                        }
                        onChange={(e) => {
                          let target = e.currentTarget.value;
                          if (!target) return null;
                          setDates((prev) => {
                            return {
                              ...prev,
                              endDate: target,
                            };
                          });
                        }}
                        className="h-8 w-full min-w-[15ch] p-1 ring-1 ring-text active:ring-link  dark:text-contrast"
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
                    <div className="mt-4 flex w-full justify-evenly p-4 ">
                      <Button
                        title="Filter"
                        text="filter"
                        fn={(e) => {
                          if (dates.endDate < dates.startDate) {
                            setNotify({
                              error: true,
                              show: true,
                              message:
                                "Invalid Parametes, Second Field Should Container Later Date",
                            });
                          } else {
                            fn(e, dates);

                            passDates ? passDates(dates) : null;
                          }
                        }}
                      />
                      <Button
                        title="cancel"
                        text="Cancel"
                        fn={() => setShow(false)}
                      />
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
