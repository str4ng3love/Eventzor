"use client";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import ButtonWithIcon from "./ButtonWithIcon";
import { useEffect, useState } from "react";
import ButtonSkeleton from "../static/ButtonSkeleton";
import { getIDType } from "@/helpers/getIDtype";
interface Props {
  commentId?: string;
  eventId?: string;
  itemId?: string;
  amountOfLikes: number;
  amountOfDislikes: number;
}
const LikeAndDislike = ({
  commentId,
  eventId,
  itemId,
  amountOfLikes,
  amountOfDislikes,
}: Props) => {
  const [parentData, setParentData] = useState({
    commentId,
    eventId,
    itemId,
    amountOfLikes,
    amountOfDislikes,
  });
  const [liked, setLiked] = useState<unknown>();
  const [disliked, setDisliked] = useState<unknown>();
  const [working, setWorking] = useState(false);

  const CheckStatus = async () => {
    try {
      const { urlPart, id } = getIDType(commentId, eventId, itemId);
      const searchParams = new URLSearchParams({ id, type: urlPart });
      const resp = await fetch(`/api/social?` + searchParams);
      const data = await resp.json();
      if (data.social._count.likes > 0) {
        setLiked(true);
        setDisliked(false)
      } else if (data.social._count.dislikes > 0) {
        setLiked(false)
        setDisliked(true);
      } else {
        setLiked(false)
        setDisliked(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async () => {
    try {
      setWorking(true);
      if (!liked && disliked) {
        setParentData((prev) => ({
          ...prev,
          amountOfDislikes: (prev.amountOfDislikes -= 1),
          amountOfLikes: (prev.amountOfLikes += 1),
        }));
      } else if (liked) {
        setParentData((prev) => ({
          ...prev,
          amountOfLikes: (prev.amountOfLikes -= 1),
        }));
      } else {
        setParentData((prev) => ({
          ...prev,
          amountOfLikes: (prev.amountOfLikes += 1),
        }));
      }
      if (disliked) {
        setDisliked(false);
      }
      setLiked(!liked);
      const { urlPart, id } = getIDType(
        parentData.commentId,
        parentData.eventId,
        parentData.itemId
      );

      const resp = await fetch(`/api/social/like/${urlPart}`, {
        method: liked ? "DELETE" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await resp.json();

      setWorking(false);
    } catch (error) {
      setWorking(false);
      setLiked(!liked);
      console.log(error);
    }
  };
  const handleDislike = async () => {
    try {
      setWorking(true);
      if (!disliked && liked) {
        setParentData((prev) => ({
          ...prev,
          amountOfDislikes: (prev.amountOfDislikes += 1),
          amountOfLikes: (prev.amountOfLikes -= 1),
        }));
      } else if (disliked) {
        setParentData((prev) => ({
          ...prev,
          amountOfDislikes: (prev.amountOfDislikes -= 1),
        }));
      } else {
        setParentData((prev) => ({
          ...prev,
          amountOfDislikes: (prev.amountOfDislikes += 1),
        }));
      }
      if (liked) {
        setLiked(false);
      }
      setDisliked(!disliked);
      const { urlPart, id } = getIDType(
        parentData.commentId,
        parentData.eventId,
        parentData.itemId
      );

      const resp = await fetch(`/api/social/dislike/${urlPart}`, {
        method: disliked ? "DELETE" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await resp.json();
      setWorking(false);
    } catch (error) {
      setWorking(false);
      setDisliked(!disliked);
      console.log(error);
    }
  };
  useEffect(() => {
    CheckStatus();
  }, []);

  return (
    <>
      {typeof liked !== "boolean" ? (
      <>  <ButtonSkeleton />  <ButtonSkeleton /></>
      ) : (
        <div className="flex h-fit gap-2">
          {liked ? (
            <ButtonWithIcon
              size="1em"
              Icon={BiSolidLike}
              bgColor="bg-transparent"
              title="Like"
              fn={() => {
                working ? null : handleLike();
              }}
              text={parentData.amountOfLikes.toString()}
            />
          ) : (
            <ButtonWithIcon
              size="1em"
              Icon={BiLike}
              bgColor="bg-transparent"
              title="Like"
              fn={() => {
                working ? null : handleLike();
              }}
              text={parentData.amountOfLikes.toString()}
            />
          )}

          {disliked ? (
            <ButtonWithIcon
              size="1em"
              Icon={BiSolidDislike}
              bgColor="bg-transparent"
              title="Like"
              fn={() => {
                working ? null : handleDislike();
              }}
              text={parentData.amountOfDislikes.toString()}
            />
          ) : (
            <ButtonWithIcon
              size="1em"
              Icon={BiDislike}
              bgColor="bg-transparent"
              title="Like"
              fn={() => {
                working ? null : handleDislike();
              }}
              text={parentData.amountOfDislikes.toString()}
            />
          )}
        </div>
      )}
    </>
  );
};

export default LikeAndDislike;
