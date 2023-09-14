"use client";
import { BiLike, BiSolidLike } from "react-icons/bi";
import ButtonWithIcon from "./ButtonWithIcon";
import { useEffect, useState, useTransition } from "react";
import ButtonSkeleton from "../static/ButtonSkeleton";
import { getIDType } from "@/helpers/getIDtype";
interface Props {
  commentId?: string;
  eventId?: string;
  itemId?: string;
  amount: number;
}
const Like = ({ commentId, eventId, itemId, amount }: Props) => {
  const [like, setLike] = useState({ commentId, eventId, itemId, amount });
  const [liked, setLiked] = useState<unknown>();
  const [isPending, startTransition] = useTransition();

  const CheckIfLiked = async () => {
    try {
      const { urlPart, id } = getIDType(commentId, eventId, itemId);
      const searchParams = new URLSearchParams({ id });
      const resp = await fetch(`/api/like/${urlPart}?` + searchParams);
      const data = await resp.json();
   
     if(data.like===null){
      setLiked(false)
     } else {
      setLiked(true)
     }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async () => {
    try {
      setLike((prev) => ({
        ...prev,
        amount: (prev.amount += 1),
      }));
      const { urlPart, id } = getIDType(commentId, eventId, itemId);

      const resp = await fetch(`/api/like/${urlPart}`, {
        method: liked ? "DELETE" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await resp.json();
      if (data.error) {
      } else {
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    CheckIfLiked();
    console.log(liked)
  }, []);
  return (
    <>
      {typeof liked !== "boolean" ? (
        <ButtonSkeleton />
      ) : (
        <>
       
          {liked ? (
            <ButtonWithIcon
              size="1em"
              Icon={BiSolidLike}
              bgColor="bg-transparent"
              title="Like"
              fn={() => {
                handleLike();
              }}
              text={like.amount.toString()}
            />
          ) : (
            <ButtonWithIcon
              size="1em"
              Icon={BiLike}
              bgColor="bg-transparent"
              title="Like"
              fn={() => {
                handleLike();
              }}
              text={like.amount.toString()}
            />
          )}
        </>
      )}
    </>
  );
};

export default Like;
