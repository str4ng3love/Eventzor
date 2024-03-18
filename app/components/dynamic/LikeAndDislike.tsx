"use client";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import ButtonWithIcon from "./ButtonWithIcon";
import { useEffect, useState } from "react";
import ButtonSkeleton from "../static/ButtonSkeleton";
import { getIDType } from "@/helpers/getIDtype";
import { useSession } from "next-auth/react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
interface Props {
  commentId?: string;
  eventId?: string;
  itemId?: string;
  amountOfLikes: number;
  amountOfDislikes: number;
  hidden?: boolean;
}
const LikeAndDislike = ({
  commentId,
  eventId,
  itemId,
  amountOfLikes,
  amountOfDislikes,
  hidden = false,
}: Props) => {
  const [parentData, setParentData] = useState({
    commentId,
    eventId,
    itemId,
    amountOfLikes,
    amountOfDislikes,
  });

  const { data: session } = useSession();

  const [liked, setLiked] = useState<unknown>();
  const [disliked, setDisliked] = useState<unknown>();
  const [working, setWorking] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const CheckStatus = async () => {
    if (session?.user) {
      try {
        const { urlPart, id } = getIDType(commentId, eventId, itemId);

        const searchParams = new URLSearchParams({ id, type: urlPart });
        const resp = await fetch(`/api/social?` + searchParams);
        const data = await resp.json();
        if (data.social._count.likes > 0) {
          setLiked(true);
          setDisliked(false);
        } else if (data.social._count.dislikes > 0) {
          setLiked(false);
          setDisliked(true);
        } else {
          setLiked(false);
          setDisliked(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setDisliked(false);
      setLiked(false);
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
        parentData.itemId,
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
        parentData.itemId,
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
    <div className="w-full p-2">
      {typeof liked !== "boolean" ? (
        <div className="flex h-fit gap-2">
          <ButtonSkeleton /> <ButtonSkeleton />
        </div>
      ) : (
        <>
          {session?.user ? (
            <div className="flex h-fit gap-2">
              {liked ? (
                <ButtonWithIcon
                  size="1em"
                  Icon={BiSolidLike}
                  bgColor="bg-transparent"
                  title="Remove like"
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
                  title="Remove dislike"
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
                  title="Dislike"
                  fn={() => {
                    working ? null : handleDislike();
                  }}
                  text={parentData.amountOfDislikes.toString()}
                />
              )}
            </div>
          ) : (
            <>
              <div className="flex h-fit gap-2">
                <ButtonWithIcon
                  size="1em"
                  Icon={BiLike}
                  bgColor="bg-transparent"
                  title="Login to Like"
                  fn={() => {
                    setShowLogin(true);
                  }}
                  text={parentData.amountOfLikes.toString()}
                />

                <ButtonWithIcon
                  size="1em"
                  Icon={BiDislike}
                  bgColor="bg-transparent"
                  title="Login to Dislike"
                  fn={() => {
                    setShowLogin(true);
                  }}
                  text={parentData.amountOfDislikes.toString()}
                />
              </div>
            </>
          )}

          <div
            className={`relative mt-4 flex h-1 w-[100%] justify-between ${hidden ? "hidden" : ""}`}
          >
            <div
              className={`h-1 w-[${((parentData.amountOfLikes / (parentData.amountOfLikes + parentData.amountOfDislikes)) * 100).toFixed(0)}%] bg-primary`}
            />
            <div
              className={`h-1 w-[${((parentData.amountOfDislikes / (parentData.amountOfLikes + parentData.amountOfDislikes)) * 100).toFixed(0)}%] bg-secondary`}
            />
          </div>
        </>
      )}
      {showLogin ? (
        <LoginForm
          show={true}
          cleanUp={() => setShowLogin(false)}
          switchFn={() => setShowRegister(true)}
        />
      ) : null}
      {showRegister ? (
        <RegisterForm
          show={true}
          cleanUp={() => setShowRegister(false)}
          switchFn={() => setShowLogin(true)}
        />
      ) : null}
    </div>
  );
};

export default LikeAndDislike;
