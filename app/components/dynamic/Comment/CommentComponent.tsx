"use client";

import TimeDifference from "@/helpers/TimeDifference";
import AddComment from "./AddComment";
import { useEffect, useState } from "react";
import { BiDotsVerticalRounded, BiDownArrow } from "react-icons/bi";
import { Comment, CommentStatus } from "@prisma/client";
import SpinnerMini from "../../static/SpinnerMini";
import Reply from "./Reply";
import { FormatString } from "@/helpers/FormatString";
import DropDownMini from "../DropDownMini";
import { useSession } from "next-auth/react";
import Button from "../Button";
import Notification from "../../static/Notification";
import LikeAndDislike from "../LikeAndDislike";

interface Props {
  id: string;
  author: string;
  text: string;
  status: CommentStatus;
  createdAt: Date;
  updatedAt?: Date | null;
  amountOfReplies?: number;
  likes: number;
  dislikes: number;
}
export interface ReplyProps extends Comment {
  _count: { children: number; likes: number; dislikes: number };
}
const CommentComponent = ({
  text,
  author,
  createdAt,
  updatedAt,
  id,
  status,
  amountOfReplies,
  likes,
  dislikes,
}: Props) => {
  const [comment, setComment] = useState({
    text,
    author,
    createdAt,
    updatedAt,
    id,
    amountOfReplies,
    likes,
    dislikes,
  });
  const [notify, setNotify] = useState({
    show: false,
    error: false,
    message: "",
  });
  const [commentTextEdited, setCommentTextEdited] = useState("");
  const [fallbackText, setFallbackText] = useState("");
  const [replies, setReplies] = useState<ReplyProps[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [edit, setEdit] = useState(false);
  const { data: session } = useSession();
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
  const handleEdit = async (id: string, text: string) => {
    if (text.length === 0) {
      return setEdit(false);
    }
    setFallbackText(text);
    setComment((prev) => ({
      ...prev,
      text: commentTextEdited,
    }));
    setEdit(false);
    try {
      const resp = await fetch("/api/comment", {
        method: "PATCH",
        body: JSON.stringify({ id, text }),
      });
      const data = await resp.json();

      if (data.error) {
        setNotify({ show: true, error: true, message: data.error });
        setComment((prev) => ({ ...prev, text: fallbackText }));
      }
      if (data.updatedComment.message === comment.text) {
        setNotify({ show: true, error: false, message: data.message });
        setComment((prev) => ({
          ...prev,
          text: data.updatedComment.message,
          updatedAt: data.updatedComment.updatedAt,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const resp = await fetch("/api/comment", {
        method: "DELETE",
        body: JSON.stringify(id),
      });
      const data = await resp.json();
      console.log(data);
      if (data.error) {
        setNotify({ show: true, error: true, message: data.error });
      }
      if (data.message) {
        setNotify({ show: true, error: false, message: data.message });
        setComment((prev) => ({ ...prev, text: "Comment Deleted" }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setComment({
      amountOfReplies,
      author,
      createdAt,
      id,
      text,
      updatedAt,
      likes,
      dislikes,
    });
  }, []);
  if (status === "flaggedAsDeleted") {
    return (
      <>
        <div className="flex w-full flex-col my-4 hover:ring-2 ring-primary rounded-md">
          <div className=" p-2 w-full flex items-center justify-between">
            <div>
              <span>{comment.author}</span>
              <span className="text-sm pl-4">
                {TimeDifference(
                  Date.now(),
                  Date.parse(comment.createdAt?.toUTCString())
                )}
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
                        amountOfLikes={r._count.likes}
                        amountOfDislikes={r._count.dislikes}
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

        {notify.show ? (
          <Notification
            {...notify}
            onAnimEnd={() =>
              setNotify({ error: false, message: "", show: false })
            }
          />
        ) : (
          <></>
        )}
      </>
    );
  } else {
    return (
      <>
        <div className="flex w-full flex-col my-4 hover:ring-2 ring-primary rounded-md">
          <div className=" p-2 w-full flex items-center justify-between">
            <div>
              <span>{comment.author}</span>
              <span className="text-sm pl-4">
                {comment.updatedAt ? "(edited) " : ""}
                {TimeDifference(
                  Date.now(),
                  Date.parse(comment.createdAt?.toUTCString())
                )}
              </span>
            </div>
            <div>
              {session?.user?.name === comment.author ? (
                <DropDownMini
                  items={[
                    {
                      text: "delete",
                      fn: () => {
                        handleDelete(comment.id);
                      },
                    },
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
                {FormatString(comment.text)}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  size="text-xs"
                  title="Appply changes"
                  text="Apply"
                  fn={() => {
                    handleEdit(comment.id, commentTextEdited);
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
              {FormatString(comment.text)}
            </div>
          )}

          <div className="flex p-2 w-full gap-2">
            <LikeAndDislike
              commentId={id}
              amountOfLikes={comment.likes}
              amountOfDislikes={comment.dislikes}
            />

            <AddComment title="Reply" reply parentId={id} />
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
                        amountOfLikes={r._count.likes}
                        amountOfDislikes={r._count.dislikes}
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
        {notify.show ? (
          <Notification
            {...notify}
            onAnimEnd={() =>
              setNotify({ error: false, message: "", show: false })
            }
          />
        ) : (
          <></>
        )}
      </>
    );
  }
};

export default CommentComponent;
