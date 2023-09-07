"use client";
import TimeDifference from "@/helpers/TimeDifference";
import AddComment from "./AddComment";
import { useEffect, useState } from "react";
import SpinnerMini from "../../static/SpinnerMini";
import { BiDownArrow } from "react-icons/bi";
import { ReplyProps } from "./CommentComponent";
import { FormatString} from "@/helpers/FormatString";
interface Props {
  id: string;
  message: string;
  authorName: string;
  createdAt: Date;
  updatedAt?: Date | null;
  amountOfReplies: number;
}

const Reply = ({
  authorName,
  id,
  message,
  createdAt,
  updatedAt,
  amountOfReplies,
}: Props) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<ReplyProps[]>([]);

  const getReplies = async (parentId: string) => {
    try {
      const resp = await fetch(
        "/api/comment/replies?" + new URLSearchParams({ id: parentId })
      );
      const data = await resp.json();
      setReplies(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    console.log(message)
  }, [])
  return (
    <div className="border-l-4 border-primary border-solid flex w-full flex-col my-2 pl-2">
      <div className="flex items-center">
        <span>{authorName}</span>
        <span className="text-sm pl-4">
          {updatedAt ? "(edited) " : ""}
          {createdAt
            ? TimeDifference(Date.now(), Date.parse(createdAt.toUTCString()))
            : ""}
        </span>
      </div>

      <div className="p-2 w-full break-words text-sm">{FormatString(message)}</div>
      <div className="flex p-2 w-full gap-2">
        <AddComment title="Reply" reply parentId={id} />
      </div>
      {amountOfReplies && amountOfReplies > 0 ? (
        <div className="flex flex-col p-2 w-full gap-2">
          <div
            onClick={(e) => {
              getReplies(id);
              setShowReplies(!showReplies);
            }}
            className="cursor-pointer flex items-center text-link rounded-md transition-all 300ms"
          >
            <span
              className={`${
                showReplies ? "-rotate-180" : "rotate-0"
              } transition-all 300ms`}
            >
              <BiDownArrow />
            </span>
            <span className="px-2">
              {amountOfReplies}&nbsp;{amountOfReplies > 1 ? "replies" : "reply"}
            </span>
          </div>
          {showReplies ? (
            <>
              {replies.length > 0 ? (
                replies.map((r) => (
                  <Reply
                    amountOfReplies={r._count.children}
                    key={r.id}
                    {...r}
                    createdAt={new Date(r.createdAt)}
                    updatedAt={r.updatedAt ? new Date(r.updatedAt) : null}
                  />
                ))
              ) : (
                <div
                  key={self.crypto.randomUUID()}
                  className="w-full flex justify-center py-2"
                >
                  <SpinnerMini />
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Reply;
