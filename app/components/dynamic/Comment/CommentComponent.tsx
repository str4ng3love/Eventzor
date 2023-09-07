"use client";

import TimeDifference from "@/helpers/TimeDifference";
import AddComment from "./AddComment";
import { useState } from "react";
import { BiDownArrow } from "react-icons/bi";
import { Comment } from "@prisma/client";
import SpinnerMini from "../../static/SpinnerMini";
import Reply from "./Reply";
import { FormatString } from "@/helpers/FormatString";

interface Props {
  id: string;
  author: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date | null;
  amountOfReplies?: number;
}
export interface ReplyProps extends Comment {
  _count: { children: number };
}
const CommentComponent = ({
  text,
  author,
  createdAt,
  updatedAt,
  id,
  amountOfReplies,
}: Props) => {
  const [replies, setReplies] = useState<ReplyProps[]>([]);
  const [showReplies, setShowReplies] = useState(false);

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
  return (
    <div className="flex w-full flex-col my-4 hover:ring-2 ring-primary rounded-md">
      <div className=" p-2 w-full flex items-center ">
        <span>{author}</span>
        <span className="text-sm pl-4">
          {updatedAt ? "(edited) " : ""}
          {createdAt
            ? TimeDifference(Date.now(), Date.parse(createdAt?.toUTCString()))
            : ""}
        </span>
      </div>
      <div className=" p-2 w-full break-words text-sm">
        {FormatString(text)}
      </div>
      <div className="flex p-2 w-full gap-2 ">
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
                    key={r.id}
                    amountOfReplies={r._count.children}
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

export default CommentComponent;
