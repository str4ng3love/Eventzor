"use client";

import AddComment from "./AddComment";
import { useEffect, useState } from "react";
import SpinnerMini from "../../static/SpinnerMini";
import { BiDotsVerticalRounded, BiDownArrow } from "react-icons/bi";
import { ReplyProps } from "./CommentComponent";

import DropDownMini from "../DropDownMini";
import { useSession } from "next-auth/react";
import { CommentStatus } from "@prisma/client";
import Button from "../Button";
import LikeAndDislike from "../LikeAndDislike";
import { CommentType } from "@/types/enums";
import TimeDifference from "@/helpers/timeDifference";
import FormatString from "@/helpers/formatString";

interface Props {
  id: string;
  message: string;
  status: CommentStatus;
  authorName: string;
  createdAt: Date;
  updatedAt?: Date | null;
  amountOfReplies: number;
  amountOfLikes: number;
  amountOfDislikes: number;
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
  amountOfDislikes,
}: Props) => {
  const [commentTextEdited, setCommentTextEdited] = useState("");
  const [fallbackText, setFallbackText] = useState("");
  const [edit, setEdit] = useState(false);
  const [whenCommented, setWhenCommented] = useState<string>();
  const [reply, setReply] = useState({
    authorName,
    id,
    message,
    createdAt,
    updatedAt,
    amountOfReplies,
    status,
    amountOfLikes,
    amountOfDislikes,
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
        "/api/comments/replies?" + new URLSearchParams({ id: parentId }),
      );
      const data = await resp.json();

      setReplies(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = async (id: string, text: string) => {
    try {
      const resp = await fetch("/api/comments", {
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
  const handleDelete = async (id: string) => {
    try {
      const resp = await fetch("/api/comments", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      const data: { message?: string; error?: string } = await resp.json();
      if (data.error) {
        setNotify({ show: true, error: true, message: data.error });
      }

      if (data.message?.includes("successfully")) {
        setReply((prev) => ({ ...prev, status: "flaggedAsDeleted" }));
        setNotify({ show: true, error: false, message: data.message });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setWhenCommented(
      TimeDifference(Date.now(), Date.parse(reply.createdAt?.toUTCString())),
    );
  }, []);

  if (reply.status === "flaggedAsDeleted") {
    return (
      <div className="my-2 flex w-full flex-col border-l-4 border-solid border-primary pl-2">
        <div className="flex items-center  justify-between">
          <div className="flex items-center">
            <span>{reply.authorName}</span>
            <span className="pl-4 text-sm">
              {whenCommented ? (
                whenCommented
              ) : (
                <SpinnerMini borderSize="border-2" h="h-2" w="w-2" />
              )}
            </span>
          </div>
        </div>

        <div className=" text-text_inactive w-full break-words p-2 text-sm">
          Comment deleted
        </div>
        {reply.amountOfReplies && reply.amountOfReplies > 0 ? (
          <div className="flex w-full flex-col gap-2 p-2">
            <div
              onClick={(e) => {
                if (!showReplies) {
                  getReplies(id);
                }
                setShowReplies(!showReplies);
              }}
              className="flex cursor-pointer items-center rounded-md text-link transition-all duration-300"
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
                  <div className="flex w-full justify-center py-2">
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
      <div
        className={`border-l-4 ${reply.authorName === session?.user?.name ? "border-primary" : "border-bg_interactive"} my-2 flex w-full flex-col border-solid pl-2`}
      >
        <div className="flex items-center  justify-between">
          <div className="flex items-center">
            <span>{reply.authorName}</span>
            <span className="pl-4 text-sm">
              {reply.updatedAt ? "(edited) " : ""}
              {whenCommented ? (
                whenCommented
              ) : (
                <SpinnerMini borderSize="border-2" h="h-2" w="w-2" />
              )}
            </span>
          </div>
          <div>
            {session?.user?.name === reply.authorName ? (
              <div>
                <DropDownMini
                  items={[
                    {
                      text: "delete",
                      fn: () => {
                        handleDelete(reply.id);
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
              className="text-text_inactive bg-interactive_text 500ms mx-2 my-8 resize-none break-all rounded-md p-2 text-sm ring-2 ring-primary transition-all"
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
          <div className=" w-full break-words p-2 text-sm">
            {FormatString(reply.message)}
          </div>
        )}
        <div className="flex w-full flex-col gap-2 p-2">
          <LikeAndDislike
            commentId={reply.id}
            amountOfLikes={reply.amountOfLikes}
            amountOfDislikes={reply.amountOfDislikes}
            hidden
          />
          <AddComment
            title="Reply"
            reply
            id={reply.id}
            callback={() =>
              setReply((prev) => ({
                ...prev,
                amountOfReplies: amountOfReplies + 1,
              }))
            }
            type={CommentType.parent}
          />
        </div>
        {reply.amountOfReplies && reply.amountOfReplies > 0 ? (
          <div className="flex w-full flex-col gap-2 p-2">
            <div
              onClick={(e) => {
                if (!showReplies) {
                  getReplies(id);
                }
                setShowReplies(!showReplies);
              }}
              className="flex cursor-pointer items-center rounded-md text-link transition-all duration-300"
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
                  <div className="flex w-full justify-center py-2">
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
