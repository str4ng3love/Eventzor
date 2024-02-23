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
    setActive((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };
  const showNext = () => {
    setActive((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

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
      window.removeEventListener("currency", () => {});
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

  return (
    <div
      className={`${
        fullWidthBlur
          ? "flex w-full flex-col items-center justify-center pb-4 pt-20 shadow-[inset_0rem_0rem_3rem_black] backdrop-blur-sm"
          : ""
      } ${darkBgAlpha ? "lg:bg-black/40 " : ""} `}
    >
      <Heading1
        text={heading}
        textColor="text-contrast dark:text-text"
        textShadow={`[text-shadow:_0_0_30px_black]`}
      />
      <div className={`flex w-fit flex-col items-center`}>
        <div className="flex items-center justify-evenly py-12">
          <span
            onClick={(e) => showPrevious()}
            className="z-30 cursor-pointer p-2 text-3xl text-contrast transition-all duration-300 hover:animate-pulse hover:text-contrast dark:text-text"
          >
            <BiSolidLeftArrow />
          </span>
          <div
            className={`flex w-[75dvw] max-w-[1280px] overflow-hidden transition-all duration-150 md:w-[50dvw]`}
          >
            {/* TODO animate the carousel */}

            <div className="w-80 min-w-full">
              <EventCarouselItem currency={currency} item={items[active]} />
            </div>
          </div>
          <span
            onClick={(e) => {
              showNext();
            }}
            className="z-30 cursor-pointer p-2 text-3xl text-contrast transition-all duration-300 hover:animate-pulse hover:text-contrast dark:text-text"
          >
            <BiSolidRightArrow />
          </span>
        </div>
      </div>
      <div className="flex w-full justify-center p-4">
        {items.map((c, i) => (
          <span
            onClick={(e) => setActive(i)}
            key={i}
            className={`h-4 w-4 ${
              active === i ? "bg-link" : "bg-interactive"
            } mx-2 block cursor-pointer rounded-sm p-2 transition-all duration-300 hover:bg-bg hover:shadow-link dark:hover:bg-text`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default EventCarousel;
