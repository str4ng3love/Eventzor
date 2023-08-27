"use client";

import Notification from "../../static/Notification";
import Image from "next/image";
import { useState, Fragment } from "react";
import Button from "../Button";
import { Dialog, Transition } from "@headlessui/react";

interface Props {
  images: string[];
  id: string;
}
const EditImages = ({ images, id }: Props) => {
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
    const resp = await fetch("/api/events/images", {
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
      setNotify({ error: false, show: true, message: dat.message });
    }
  };
  return (
    <>
      <Button
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
            <div className="bg-black/80 fixed inset-0" aria-hidden />
            <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm">
              <Dialog.Panel
              
                className={
                  "relative p-8 bg-bg_interactive text-text dark:bg-bg_interactive  w-[30rem] shadow-md shadow-black overflow-y-scroll"
                }
              >
                <Dialog.Title className={"p-2 font-bold text-xl text-center"}>
                  Edit Images
                </Dialog.Title>
                <div className="flex flex-col justify-center items-center">
                  <div className="p-4 flex justify-between z-20 gap-2 ">
                    {/*TODO: combat: error (probably) because of headlessUI portal being rendered twice */}
                    {imgArr ? (
                      imgArr.map((im, index) => (
                        <>
                          {selected === index && confirm ? (
                            <div className="flex flex-col items-center justify-evenly gap-2 p-4" >
                              <Button
                                text="Confirm"
                                bgColor="bg-red-600"
                                fn={() => {
                                  setImgArr((prev) =>
                                    prev.filter((i) => i !== im)
                                  );

                                  setConfirm(false);
                                  setSelected(null);
                                }}
                              />
                              <Button
                                text="cancel"
                                fn={() => {
                                  {
                                    setConfirm(false);
                                    setSelected(null);
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <span
                              onClick={(e) => {
                                setConfirm(true);
                                setSelected(index);
                              }}
                              key={index}
                              className="flex items-center relative after:flex after:items-center after:justify-center hover:after:content-['Delete'] hover:after:absolute after:top-0 after:left-0 after:bg-black/50 after:w-full after:h-full "
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
                        </>
                      ))
                    ) : (
                      <h2>There are no images</h2>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-between gap-2 p-2">
                      <Button
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
                        className="text-interactive_text p-1"
                      />
                    </div>
                    <div className="flex justify-center p-2">
                      {canEdit ? (
                        <Button
                          text="save changes"
                          fn={(e) => {
                            setCanEdit(false);
                            handleImageUpdate();
                          }}
                        />
                      ) : (
                        <Button
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
