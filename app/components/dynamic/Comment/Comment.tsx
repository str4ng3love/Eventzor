'use client'

import TimeDifference from "@/helpers/TimeDifference";

interface Props {
  author: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}

const Comment = ({ text, author, createdAt, updatedAt }: Props) => {
  return (
    <div className="flex w-full flex-col bg-black my-2">
      <div className=" p-2 w-full flex justify-between">
        <span>{author}</span>
        <span>
            {!updatedAt?  "(edited) ":""}
          {createdAt
            ? TimeDifference(Date.now(), Date.parse(createdAt?.toUTCString()))
            : ""}
        </span>
      </div>
      <div className=" p-2 w-full">{text}</div>


      <span>reply like etc</span>
    </div>
  );
};

export default Comment;
