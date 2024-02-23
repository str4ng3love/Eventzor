"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
}
const ImageBrowser = ({ images }: Props) => {
  const [selected, setSelected] = useState(0);
  const [playFadeOut, setPlayFadeOut] = useState(false);

  const handleChange = async (i: number) => {
    setPlayFadeOut(true);
    setTimeout(() => {
      setSelected(i);
      setPlayFadeOut(false);
    }, 150);
  };
  return (
    <div className="relative h-[400px] w-full bg-primary shadow-lg ring-2 ring-primary dark:shadow-none">
      <Image
        onClick={() => {}}
        fill
        placeholder="blur"
        blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICR`AEAOw=="
        style={{ objectFit: "cover" }}
        sizes="(max-width: 720px) 100vw, (max-width: 720px) 50vw"
        alt="events image"
        src={images[selected]}
        className={`${
          playFadeOut ? "animate-fadeOut300" : "animate-fadeIn300"
        }`}
      />
      <div className="absolute flex h-full w-20 flex-col items-center justify-start gap-2 overflow-clip bg-black/60 p-2">
        {/* TODO: custom scroll*/}
        {images.map((i, index) => (
          <Image
            key={index}
            onClick={() => handleChange(index)}
            placeholder="blur"
            blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
            width={70}
            height={50}
            style={{ objectFit: "cover" }}
            sizes="(max-width: 750px"
            alt="events image"
            className={` ${
              index === selected ? "ring-2 ring-link" : ""
            } self-center ring-link transition-all duration-300 hover:ring-2`}
            src={i}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageBrowser;
