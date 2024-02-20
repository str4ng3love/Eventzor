"use client";
import { useEffect, useState } from "react";
import { Heading1 } from "../../static/Heading";
import EventCarouselItem from "./EventCarouselItem";
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
  fullWidthBlur?: boolean;
  darkBgAlpha?: boolean;
}
// TO DO: animations
const EventCarousel = ({
  items,
  heading,
  darkBgAlpha = false,
  fullWidthBlur = false,
}: Props) => {

  const [active, setActive] = useState(0);
  const [currency, setCurrency] = useState({ name: "initial", rate: 1 });

  const showPrevious = () => {

    setActive((prev) => (prev === 0 ? items.length - 1 : prev - 1))

  }
  const showNext = () => {

    setActive((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  }

  useEffect(() => {
    window.addEventListener("currency", () => {
      const currency = localStorage.getItem("currency");
      if (currency) {
        let selectedCurrency = JSON.parse(currency);
        setCurrency({
          name: selectedCurrency.name,
          rate: selectedCurrency.rate,
        });
      } else {
        setCurrency({
          name: "usd",
          rate: 1,
        });
      }
    });
    return () => {
      window.removeEventListener("currency", () => { });
    };
  }, []);

  useEffect(() => {
    let prefCurrency = localStorage.getItem("currency");
    if (prefCurrency) {
      let selectedCurrency = JSON.parse(prefCurrency);
      setCurrency({
        name: selectedCurrency.name,
        rate: selectedCurrency.rate,
      });
    }
    if (!prefCurrency) {
      setCurrency({
        name: "usd",
        rate: 1,
      });
    }
  }, []);

  if (items.length > 0) {
    return (
      <div
        className={`${fullWidthBlur
          ? "w-full flex flex-col items-center justify-center backdrop-blur-sm shadow-[inset_0rem_0rem_3rem_black] pb-4 pt-20"
          : ""
          } ${darkBgAlpha ? "lg:bg-black/20 " : ""} `}
      >

        <Heading1 text={heading} textShadow={`[text-shadow:_0_0_30px_black]`} />
        <div className={`flex flex-col items-center lg:w-fit`}>

          <div className="flex items-center justify-evenly py-12">
            <span
              onClick={(e) =>
                showPrevious()
              }
              className="p-2 text-3xl text-text_inactive hover:text-text transition-all duration-300 cursor-pointer z-30"
            >
              <BiSolidLeftArrow />
            </span>
            <div className={`overflow-hidden flex md:w-[50dvw] w-[75dvw] max-w-[1280px] transition-all duration-150`}>

                  {/* TODO animate the carousel */}

              <div className="min-w-full">
                <EventCarouselItem currency={currency} item={items[active]} />

              </div>
            </div>
            <span
              onClick={(e) => {
                showNext()
              }}
              className="p-2 text-3xl text-text_inactive hover:text-text transition-all duration-300 cursor-pointer z-30"
            >
              <BiSolidRightArrow />
            </span>
          </div>
        </div>
        <div className="flex justify-center p-4 w-full">
          {items.map((c, i) => (
            <span
              onClick={(e) => setActive(i)}
              key={i}
              className={`h-4 w-4 ${active === i ? "bg-text" : "bg-text_inactive"
                } hover:bg-text hover:shadow-link transition-all duration-300 block mx-2 p-2 rounded-sm cursor-pointer`}
            ></span>
          ))}
        </div>
      </div >
    );
  } else {
    return <span>Loading...</span>;
  }
};

export default EventCarousel;
