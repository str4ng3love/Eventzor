"use client";
import { BiDislike, BiSolidDislike } from "react-icons/bi";
import ButtonWithIcon from "./ButtonWithIcon";
import { useState } from "react";
interface Props {
  id: string;
}
const Dislike = ({ id }: Props) => {
  const [disliked, setDisliked] = useState();

  return (
    <>
      {disliked ? (
        <ButtonWithIcon
          size="1em"
          Icon={BiSolidDislike}
          bgColor="bg-transparent"
          title="Like"
          fn={() => {}}
        />
      ) : (
        <ButtonWithIcon
          size="1em"
          Icon={BiDislike}
          bgColor="bg-transparent"
          title="Like"
          fn={() => {}}
        />
      )}
    </>
  );
};
export default Dislike;
