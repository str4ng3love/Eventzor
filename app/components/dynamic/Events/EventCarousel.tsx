"use client";
import { useEffect, useState } from "react";
import { Heading1, Heading3, Heading4 } from "../../static/Heading";
import Image from "next/image";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import Link from "next/link";
import SpinnerMini from "../../static/SpinnerMini";
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
const EventCarousel = ({
  items,
  heading,
  darkBgAlpha = false,
  fullWidthBlur = false,
}: Props) => {
  const [selectedImage, setSelectedImage] = useState(items[0].images[0]);
  const [playFadeOut, setPlayFadeOut] = useState(false);
  const [active, setActive] = useState(0);
  const [currency, setCurrency] = useState({ name: "initial", rate: 1 });

  const readAddress = () => {
    console.log(encodeURI(items[active].title));
  };
  const handleChange = async (image: string) => {
    setPlayFadeOut(true);
    setTimeout(() => {
      setSelectedImage(image);
      setPlayFadeOut(false);
    }, 150);
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
  useEffect(() => {
    setSelectedImage(items[active].images[0]);
  }, [active]);
  if (items.length > 0) {
    return (
      <div
        className={`${
          fullWidthBlur
            ? "w-full flex justify-center backdrop-blur-sm shadow-[inset_0rem_0rem_3rem_black] pb-4 pt-20"
            : ""
        } ${darkBgAlpha ? "lg:bg-black/20 " : ""}`}
      >
        <div className={`flex flex-col lg:w-[50rem] w-[30rem]`}>
          <Heading1 text={heading} />

          <div className="flex items-center justify-between h-[20rem] ">
            <span
              onClick={(e) =>
                setActive((prev) => (prev === 0 ? items.length - 1 : prev - 1))
              }
              className="p-2 text-3xl text-text_inactive hover:text-text transition-all duration-300 cursor-pointer"
            >
              <BiSolidLeftArrow />
            </span>
            <div className=" w-full h-full flex justify-between ring-2 ring-primary shadow-omni">
              <Link
                href={"/events/" + encodeURIComponent(items[active].title)}
                title={items[active].title}
                className={`relative group lg:w-[67%] w-full overflow-hidden  bg-black`}
              >
                <span className="opacity-0 absolute z-50 h-full w-full bg-black/40 flex lg:hidden group-hover:opacity-100 justify-center items-center text-xl font-bold transition-all duration-300">
                  {items[active].title}
                </span>
                <Image
                  fill
                  placeholder="blur"
                  blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 750px"
                  alt="events image"
                  src={selectedImage}
                  className={`${
                    playFadeOut ? "animate-fadeOut300" : "animate-fadeIn300"
                  }`}
                />
              </Link>
              <div className=" hidden w-[33%] bg-gradient-to-br from-primary to-slate-900 lg:flex flex-col justify-between">
                <h3 className="p-2 first-letter:uppercase font-bold text-xl grow-[1]">
                  {items[active].title}
                </h3>
                <div className="grid grid-cols-3 gap-2 px-2 overflow-hidden relative h-1/2 grow-[1]">
                  {items[active].images.map((i, index) => (
                    <Image
                      className={` ${
                        i === selectedImage ? "ring-2 ring-link" : ""
                      } hover:ring-2 ring-link self-center transition-all duration-300`}
                      onClick={() => {
                        if (i === selectedImage) {
                          return;
                        }
                        handleChange(i);
                      }}
                      alt="events image"
                      placeholder="blur"
                      blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkOAMAANIAzr59FiYAAAAASUVORK5CYII="
                      key={index}
                      src={i}
                      width={75}
                      height={75}
                    />
                  ))}
                </div>
          
                <div className="shrink-0 text-sm flex flex-col items-end justify-between">
                  <span className="p-1">
                    {items[active].eventDate.toLocaleDateString()}
                  </span>
                  <div className="flex justify-between w-full">
                    <span className="p-1">
                      {items[active].tickets - items[active].ticketsSold}{" "}
                      tickets left
                    </span>
                    <span className="p-1 flex items-center justify-center">
                      {currency.name === "initial" ? (
                        <SpinnerMini
                          h="h-4"
                          w="w-4"
                          borderSize="border-[3px]"
                        />
                      ) : (
                        (items[active].price * currency.rate).toFixed(2)
                      )}
                      &nbsp;
                      {currency.name === "initial"
                        ? ""
                        : currency.name.toLocaleUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <span
              onClick={(e) => {
                setActive((prev) => (prev === items.length - 1 ? 0 : prev + 1));
              }}
              className="p-2 text-3xl text-text_inactive hover:text-text transition-all duration-300 cursor-pointer"
            >
              <BiSolidRightArrow />
            </span>
          </div>
          <div className="flex justify-center p-4">
            {items.map((c, i) => (
              <span
                onClick={(e) => setActive(i)}
                key={i}
                className={`h-4 w-4 ${
                  active === i ? "bg-text" : "bg-text_inactive"
                } hover:bg-text hover:shadow-link transition-all duration-300 block mx-2 p-2 rounded-sm cursor-pointer`}
              ></span>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return <h2>Loading...</h2>;
  }
};

export default EventCarousel;
