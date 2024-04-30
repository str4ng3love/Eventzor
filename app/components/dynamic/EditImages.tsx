"use client";

import Notification from "../static/Notification";
import Image from "next/image";
import { useState, Fragment } from "react";
import Button from "./Button";
import { Dialog, Transition } from "@headlessui/react";

export enum CallType {
  event = "events",
  item = "market",
}
interface Props {
  images: string[];
  id: string;
  triggerRefetch: () => void;
  type: CallType;
}
const EditImages = ({ type, triggerRefetch, images, id }: Props) => {
  const [show, setShow] = useState(false);
  const [imgArr, setImgArr] = useState(images);
  const [canEdit, setCanEdit] = useState(true);
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [notify, setNotify] = useState({
    error: false,
    show: false,
    message: "",
  });

  const handleImageUpdate = async () => {
    const resp = await fetch(`/api/${type}/images`, {
      method: "PATCH",
      headers: { "contnet-type": "application-json" },
      body: JSON.stringify({ images: imgArr, id: id }),
    });
    const dat = await resp.json();
    if (dat.error) {
      setCanEdit(true);
      setNotify({ error: true, show: true, message: dat.error });
    } else {
      setCanEdit(true);
      triggerRefetch();
      setNotify({ error: false, show: true, message: dat.message });
    }
  };
  return (
    <>
      <Button
        title="Show Images"
        text="Images"
        fn={() => {
          setShow(true);
        }}
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
            <div className="fixed inset-0 bg-black/80" aria-hidden />
            <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm">
              <Dialog.Panel
                className={
                  "bg-bg_interactive dark:bg-bg_interactive relative w-[30rem] overflow-y-scroll  p-8 text-text shadow-md shadow-black"
                }
              >
                <Dialog.Title className={"p-2 text-center text-xl font-bold"}>
                  Edit Images
                </Dialog.Title>
                <div className="flex flex-col items-center justify-center">
                  <div className="z-20 flex justify-between gap-2 p-4 ">
                    {imgArr ? (
                      imgArr.map((im, index) => (
                        <div key={index}>
                          {selected === index && confirm ? (
                            <>
                              <div className="flex flex-col items-center justify-evenly gap-2 p-4">
                                <Button
                                  title="Confirm changes"
                                  text="Confirm"
                                  bgColor="bg-red-600"
                                  fn={() => {
                                    setImgArr((prev) =>
                                      prev.filter((i) => i !== im),
                                    );

                                    setConfirm(false);
                                    setSelected(null);
                                  }}
                                />
                                <Button
                                  title="Cancel"
                                  text="cancel"
                                  fn={() => {
                                    {
                                      setConfirm(false);
                                      setSelected(null);
                                    }
                                  }}
                                />
                              </div>
                            </>
                          ) : (
                            <span
                              onClick={(e) => {
                                setConfirm(true);
                                setSelected(index);
                              }}
                              className="relative flex items-center after:left-0 after:top-0 after:flex after:h-full after:w-full after:items-center after:justify-center after:bg-black/50 hover:after:absolute hover:after:content-['Delete'] "
                            >
                              <Image
                                loading="eager"
                                src={im}
                                alt="Event image"
                                width={200}
                                height={200}
                              />
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <h2 key={self.crypto.randomUUID()}>
                        There are no images
                      </h2>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-between gap-2 p-2">
                      <Button
                        title="Add new image"
                        text="add new"
                        fn={(e) => {
                          setImgArr((prev) => [...prev, url]);
                        }}
                      />
                      <input
                        onChange={(e) => setUrl(e.currentTarget.value)}
                        onPaste={(e) => setUrl(e.currentTarget.value)}
                        placeholder="URL..."
                        type="text"
                        className="p-1 text-black "
                      />
                    </div>
                    <div className="flex justify-center p-2">
                      {canEdit ? (
                        <Button
                          title="Save changes"
                          text="save changes"
                          fn={(e) => {
                            setCanEdit(false);
                            handleImageUpdate();
                          }}
                        />
                      ) : (
                        <Button
                          title="Working..."
                          text="Saving..."
                          bgColor="bg-bg"
                          fn={(e) => {}}
                        />
                      )}
                    </div>
                    <Notification
                      message={notify.message}
                      show={notify.show}
                      error={notify.error}
                      onAnimEnd={() =>
                        setNotify({ error: false, message: "", show: false })
                      }
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default EditImages;
