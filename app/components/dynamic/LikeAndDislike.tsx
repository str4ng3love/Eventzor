"use client";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import ButtonWithIcon from "./ButtonWithIcon";
import { useEffect, useState } from "react";
import ButtonSkeleton from "../static/ButtonSkeleton";
import { getIDType } from "@/helpers/getIDtype";
import { useSession } from "next-auth/react";
import LoginForm from "./LoginForm";
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
  hidden=false
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
  const { data: session } = useSession();
  const [showLogin, setShowLogin] = useState(false);

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

          <div className={`bg-bg_interactive w-full flex justify-between h-1 ${hidden ? "hidden": ""}`}>
            {parentData.amountOfLikes === 0 && parentData.amountOfDislikes === 0 ? "" :
              <>
               
                  <span className={`h-1 block w-[${((parentData.amountOfLikes /
                  (parentData.amountOfLikes +
                    parentData.amountOfDislikes)) *
                  100).toFixed(0)
                    }%]  bg-primary`}
                  ></span>
                <span className={`h-1 block w-[${((parentData.amountOfDislikes /
                  (parentData.amountOfLikes +
                    parentData.amountOfDislikes)) *
                  100).toFixed(0)
                    }%]  bg-secondary`}
                  ></span>
              
              </>}
          </div>

        </>
      )}
      {showLogin ? (
        <LoginForm show cleanUp={() => setShowLogin(false)} />
      ) : (
        <></>
      )}

    </div>
  );
};

export default LikeAndDislike;


// {(parentData.amountOfDislikes !==0 && parentData.amountOfLikes !== 0) ||
//   isNaN(
//     (parentData.amountOfLikes /
//       (parentData.amountOfLikes + parentData.amountOfDislikes)) *
//     100
//   ) ?  (
//   <>
//     <span
//       className={`h-1 block w-[${(parentData.amountOfLikes /
//           (parentData.amountOfLikes +
//             parentData.amountOfDislikes)) *
//         100
//         }%]  bg-primary`}
//     ></span>
//     <span
//       className={`w-[${100 -
//         (parentData.amountOfLikes /
//           (parentData.amountOfLikes +
//             parentData.amountOfDislikes)) *
//         100
//         }%] bg-secondary block h-1`}
//     ></span>
//   </>
// ):<> {parentData.amountOfLikes === 0 ? <span
//   className={`h-1 block w-[100%]  bg-secondary`}
// ></span> :
// <span
//   className={`w-[100%] bg-primary block h-1`}
// ></span>}</>}