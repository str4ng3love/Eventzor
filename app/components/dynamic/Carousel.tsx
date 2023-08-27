"use client";
import { useEffect, useState } from "react";
import { Heading3, Heading4 } from "../static/Heading";
import Image from "next/image";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
interface Props {
  items: {
    title: string;
    eventDate: Date;
    closingDate: Date;
    location: string;
    price: number;
    tickets: number;
    ticketsSold: number;
    images: string[];
  }[];
  heading: string;
}
const Carousel = ({ items, heading }: Props) => {
  console.log(items);
  const [current, setCurrent] = useState(items);
  const [selectedImage, setSelectedImage] = useState(current[0].images[0]);
  const [playFadeOut, setPlayFadeOut] = useState(false);
  const [active, setActive] = useState(0);

  const handleChange = async (image: string) => {
    setPlayFadeOut(true);
    setTimeout(() => {
      setSelectedImage(image);
      setPlayFadeOut(false)
    }, 150);
  };
useEffect(()=>{
  setSelectedImage(current[active].images[0])
}, [active])
  if (current.length > 0) {
    return (
      <div className="flex flex-col lg:w-[50rem] w-[30rem]">
        <div className="p-4">
          <Heading4 text="Newest Events" />
        </div>
        <div className="flex items-center justify-between h-[20rem] ">
          <span
            onClick={(e) =>
              setActive((prev) => (prev === 0 ? current.length - 1 : prev - 1))
              
            }
            className="p-2 text-3xl text-text_inactive hover:text-text transition-all 300ms cursor-pointer"
          >
            <BiSolidLeftArrow />
          </span>
          <div className="w-full h-full flex justify-between ring-2 ring-primary shadow-omni">
            <div className="lg:w-[67%] w-full overflow-hidden relative bg-black">
              <Image
                fill
                objectFit="cover"
                alt="events image"
                src={selectedImage}
                className={`${playFadeOut ? "animate-fadeOut300" : "animate-fadeIn300"}`}
              />
            </div>
            <div className=" hidden w-[33%] bg-gradient-to-br from-primary to-slate-900 lg:flex flex-col justify-between">
              <h3 className="p-2 first-letter:uppercase font-bold text-xl grow-[1]">
                {current[active].title}
              </h3>
              <div className="grid grid-cols-3 gap-2 px-2 overflow-hidden relative h-1/2 grow-[1]">
                {current[active].images.map((i, index) => (
                  <Image
                    className={` ${
                      i === selectedImage ? "ring-2 ring-link" : ""
                    } hover:ring-2 ring-link self-center transition-all 300ms`}
                    onClick={() => {
                      if (i === selectedImage) {
                        return;
                      }
                      handleChange(i)
                    }}
                    alt="events image"
                    key={index}
                    src={i}
                    width={75}
                    height={75}
                  />
                ))}
              </div>
              <div className="shrink-0 text-sm flex flex-col items-end justify-between">
                <span className="p-1">
                 
                  {current[active].eventDate.toLocaleDateString()}
                </span>
                <div className="flex justify-between w-full"><span className="p-1">{current[active].tickets - current[active].ticketsSold} tickets left</span><span className="p-1">{current[active].price} $</span></div>
              </div>
            </div>
          </div>
          <span
            onClick={(e) => {
              setActive((prev) => (prev === current.length - 1 ? 0 : prev + 1));
            }}
            className="p-2 text-3xl text-text_inactive hover:text-text transition-all 300ms cursor-pointer"
          >
            <BiSolidRightArrow />
          </span>
        </div>
        <div className="flex justify-center p-4">
          {current.map((c, i) => (
            <span
              onClick={(e) => setActive(i)}
              key={i}
              className={`h-4 w-4 ${
                active === i ? "bg-text" : "bg-text_inactive"
              } hover:bg-text hover:shadow-link transition-all 300ms block mx-2 p-2 rounded-sm cursor-pointer`}
            ></span>
          ))}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Carousel;
