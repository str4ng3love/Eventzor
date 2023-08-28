"use client";

import { useState } from "react";
import Image from "next/image";
import Portal from "../Portal";

interface Props {
  images: string[];
}
const ImageBrowser = ({ images }: Props) => {
  const [selected, setSelected] = useState(0);
  const [playFadeOut, setPlayFadeOut] = useState(false);

  const enlarge = () => {};
  const handleChange = async (i: number) => {
    setPlayFadeOut(true);
    setTimeout(() => {
      setSelected(i);
      setPlayFadeOut(false);
    }, 150);
  };
  return (
    <div className="w-full h-[300px] relative">
      <Image
        onClick={() => {}}
        fill
        placeholder="blur"
        blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
        style={{ objectFit: "cover" }}
        sizes="(max-width: 750px"
        alt="events image"
        src={images[selected]}
        className={`${
          playFadeOut ? "animate-fadeOut300" : "animate-fadeIn300"
        }`}
      />
      <div className="absolute w-20 h-full bg-black/60 flex flex-col overflow-clip items-center justify-start p-2 gap-2">
        {/* TODO: custom scroll*/}
        {images.map((i, index) => (
          <Image
            onClick={() => handleChange(index)}
            placeholder="blur"
            blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkOAMAANIAzr59FiYAAAAASUVORK5CYII="
            width={70}
            height={50}
            style={{ objectFit: "cover" }}
            sizes="(max-width: 750px"
            alt="events image"
            className={` ${
              index === selected ? "ring-2 ring-link" : ""
            } hover:ring-2 ring-link self-center transition-all 300ms`}
            src={i}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageBrowser;
