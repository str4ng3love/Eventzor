"use client";
import TimeDifference from "@/helpers/TimeDifference";
import AddComment from "./AddComment";
import { useState } from "react";
import SpinnerMini from "../../static/SpinnerMini";
import { BiDotsVerticalRounded, BiDownArrow } from "react-icons/bi";
import { ReplyProps } from "./CommentComponent";
import { FormatString } from "@/helpers/FormatString";
import DropDownMini from "../DropDownMini";
import { useSession } from "next-auth/react";
import { CommentStatus } from "@prisma/client";
import Button from "../Button";
import LikeAndDislike from "../LikeAndDislike";
import { CommentType } from "@/types/enums";

interface Props {
  id: string;
  message: string;
  status: CommentStatus;
  authorName: string;
  createdAt: Date;
  updatedAt?: Date | null;
  amountOfReplies: number;
  amountOfLikes:number;
  amountOfDislikes:number;
}

const Reply = ({
  authorName,
  id,
  message,
  createdAt,
  updatedAt,
  status,
  amountOfReplies,
  amountOfLikes,
  amountOfDislikes
}: Props) => {
  const [commentTextEdited, setCommentTextEdited] = useState("");
  const [fallbackText, setFallbackText] = useState("");
  const [edit, setEdit] = useState(false);
  const [reply, setReply] = useState({
    authorName,
    id,
    message,
    createdAt,
    updatedAt,
    amountOfReplies,
    status,
  });
  const [showReplies, setShowReplies] = useState(false);
  const [notify, setNotify] = useState({
    show: false,
    message: "",
    error: false,
  });
  const [replies, setReplies] = useState<ReplyProps[]>([]);
  const { data: session } = useSession();

  const getReplies = async (parentId: string) => {
    try {
      const resp = await fetch(
        "/api/comment/replies?" + new URLSearchParams({ id: parentId })
      );
      const data = await resp.json();
      console.log(data)
      setReplies(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = async (id: string, text: string) => {
    try {
      const resp = await fetch("/api/comment", {
        method: "PATCH",
        body: JSON.stringify({ id, text }),
      });
      const data = await resp.json();
      if (data.error) {
        setNotify({ show: true, error: true, message: data.error });
        setReply((prev) => ({ ...prev, text: fallbackText }));
      }
      if (data.message === reply.message) {
        setNotify({ show: true, error: false, message: data.message });
        setReply((prev) => ({
          ...prev,
          message: data.updated.mesage,
          updatedAt: data.updatedComment.updatedAt,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (status === "flaggedAsDeleted") {
    return (
      <div className="border-l-4 border-primary border-solid flex w-full flex-col my-2 pl-2">
        <div className="flex items-center  justify-between">
          <div className="">
            <span>{authorName}</span>
            <span className="text-sm pl-4">
              {createdAt
                ? TimeDifference(
                    Date.now(),
                    Date.parse(createdAt.toUTCString())
                  )
                : ""}
            </span>
          </div>
        </div>

        <div className=" p-2 w-full break-words text-sm text-text_inactive">
          Comment deleted
        </div>
        {amountOfReplies && amountOfReplies > 0 ? (
          <div className="flex flex-col p-2 w-full gap-2">
            <div
              onClick={(e) => {
                getReplies(id);
                setShowReplies(!showReplies);
              }}
              className="cursor-pointer flex items-center text-link rounded-md transition-all duration-300"
            >
              <span
                className={`${
                  showReplies ? "-rotate-180" : "rotate-0"
                } transition-all duration-300`}
              >
                <BiDownArrow />
              </span>
              <span className="px-2">
                {amountOfReplies}&nbsp;
                {amountOfReplies > 1 ? "replies" : "reply"}
              </span>
            </div>
            {showReplies ? (
              <>
                {replies.length > 0 ? (
                  replies.map((r) => (
                    <Reply
                      amountOfReplies={r._count.children}
                      amountOfLikes={r._count.likes}
                      amountOfDislikes={r._count.dislikes}
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
  } else {
    return (
      <div className={`border-l-4 ${reply.authorName === session?.user?.name ? "border-primary" : "border-bg_interactive"} border-solid flex w-full flex-col my-2 pl-2`}>
        <div className="flex items-center  justify-between">
          <div className="">
            <span>{reply.authorName}</span>
            <span className="text-sm pl-4">
              {reply.updatedAt ? "(edited) " : ""}
              {reply.createdAt
                ? TimeDifference(
                    Date.now(),
                    Date.parse(createdAt.toUTCString())
                  )
                : ""}
            </span>
          </div>
          <div>
            {session?.user?.name === reply.authorName ? (
              <div>
                <DropDownMini
                  items={[
                    { text: "delete", fn: () => {} },
                    {
                      text: "Edit",
                      fn: () => {
                        setEdit(true);
                      },
                    },
                  ]}
                  Icon={BiDotsVerticalRounded}
                  size="1em"
                  bgColor="bg-transparent"
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        {edit ? (
          <div>
            <div
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setCommentTextEdited(e.currentTarget.innerHTML)}
              onPaste={(e) => setCommentTextEdited(e.currentTarget.innerHTML)}
              className="p-2 mx-2 resize-none text-text_inactive my-8 bg-interactive_text transition-all 500ms break-all ring-2 ring-primary rounded-md text-sm"
            >
              {FormatString(reply.message)}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                size="text-xs"
                title="Appply changes"
                text="Apply"
                fn={() => {
                  setFallbackText(reply.message);
                  setReply((prev) => ({
                    ...prev,
                    message: commentTextEdited,
                  }));
                  setEdit(false);
                  handleEdit(reply.id, commentTextEdited);
                }}
              />
              <Button
                size="text-xs"
                title="cancel edit"
                text="cancel"
                fn={() => {
                  setEdit(false);
                }}
              />
            </div>
          </div>
        ) : (
          <div className=" p-2 w-full break-words text-sm">
            {FormatString(reply.message)}
          </div>
        )}
        <div className="flex p-2 w-full gap-2">
          <LikeAndDislike commentId={id} amountOfLikes={amountOfLikes} amountOfDislikes={amountOfDislikes} hidden/>
          <AddComment  title="Reply" reply id={id} callback={()=>setReply((prev)=>({...prev, amountOfReplies: amountOfReplies+1}))} type={CommentType.parent}/>
        </div>
        {reply.amountOfReplies && reply.amountOfReplies > 0 ? (
          <div className="flex flex-col p-2 w-full gap-2">
            <div
              onClick={(e) => {
                getReplies(id);
                setShowReplies(!showReplies);
              }}
              className="cursor-pointer flex items-center text-link rounded-md transition-all duration-300"
            >
              <span
                className={`${
                  showReplies ? "-rotate-180" : "rotate-0"
                } transition-all duration-300`}
              >
                <BiDownArrow />
              </span>
              <span className="px-2">
                {reply.amountOfReplies}&nbsp;
                {reply.amountOfReplies > 1 ? "replies" : "reply"}
              </span>
            </div>
            {showReplies ? (
              <>
                {replies.length > 0 ? (
                  replies.map((r) => (
                    <Reply
                      amountOfReplies={r._count.children}
                      amountOfLikes={r._count.likes}
                      amountOfDislikes={r._count.dislikes}
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
  }
};

export default Reply;
