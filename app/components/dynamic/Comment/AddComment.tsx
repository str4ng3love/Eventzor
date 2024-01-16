"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Button from "../Button";
import { useSession } from "next-auth/react";
import LoginForm from "../LoginForm";
import Notification from "../../static/Notification";
import { useRouter } from "next/navigation";
import { CommentType } from "@/types/enums";

interface Props {
  title: string;
  reply?: boolean;
  id: string;
  type: CommentType
  callback?: () => void;
}
const AddComment = ({
  type,
  id,
  reply = false,
  title,
  callback,
}: Props) => {
  const [notify, setNotify] = useState({
    error: false,
    message: "",
    show: false,
  });
  const [showLogin, setShowLogin] = useState(false);
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  // ↑ ??
  const router = useRouter();

  const handleCreate = async () => {
    try {
     const resp = await fetch("/api/comment", {
          method: "POST",
          body: JSON.stringify({
            type: type,
            id: id,
            comment: comment,
          }),
        })
      const data = await resp.json();

      if (data.error) {
        setNotify({ message: data.error, show: true, error: true });
      } else {
        startTransition(() => {
          setNotify({ message: data.message, show: true, error: false });
          router.refresh();
          setShow(false);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreateReply = async () => {
    try {
      const resp = await fetch("/api/comment", {
        method: "POST",
        body: JSON.stringify({
          comment: comment,
          type:type,
          id:id
        }),
      });
      const data = await resp.json();
      //todo optimistic mount

      if (data.error) {
        setNotify({ message: data.error, show: true, error: true });
      } else {
        startTransition(() => {
          callback ? callback() : null;
          setNotify({ message: data.message, show: true, error: false });
          router.refresh();
          setShow(false);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const divEl = useRef<HTMLInputElement>(null);
  useEffect(() => {
    divEl.current?.focus();
  }, [show]);
  return (
    <>
      {show ? (
        <div
          className={`w-full px-4 ${reply ? "border-t-2 border-primary pt-4 border-dashed mt-4" : ""
            }`}
        >
          {reply ? (
            <h4 className="p-1 text-sm">Leave a Reply</h4>
          ) : (
            <h4 className="p-1">Leave a Comment</h4>
          )}
          <div
            ref={divEl}
            onInput={(e) => setComment(e.currentTarget.innerHTML)}
            onPaste={(e) => setComment(e.currentTarget.innerHTML)}
            className="p-2 resize-none text-text_inactive my-8 bg-interactive_text transition-all 500ms break-all ring-2 ring-primary rounded-md text-sm"
            placeholder="Add a comment..."
            contentEditable
          />

          <div
            className={`flex items-center ${reply ? "justify-between" : "justify-end "
              } gap-2`}
          >
            <div className="p-2 flex gap-2">
              <Button
                size="text-sm"
                title="Cancel comment creation"
                text="Cancel"
                bgColor="bg-secondary"
                fn={(e) => {
                  setShow(false);
                }}
              />
              {reply ? (
                <Button
                  size="text-sm"
                  title="Submit your reply"
                  text="Reply"
                  fn={() => {
                    handleCreateReply();
                  }}
                />
              ) : (
                <Button
                  size="text-sm"
                  title="Submit your comment"
                  text="Add"
                  fn={() => {
                    handleCreate();
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {reply ? (
            <>
              {session?.user?.name ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="text-xs"
                    title={title}
                    text="Reply"
                    bgColor="bg-transparent"
                    fn={(e) => {
                      setShow(true);
                      divEl.current?.focus();
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    size="text-xs"
                    title={title}
                    text="Reply"
                    bgColor="bg-transparent"
                    fn={(e) => {
                      setShowLogin(true);
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center my-4 justify-center">
              {session?.user?.name ? (
                <Button
                  title={title}
                  text="Add a Comment ..."
                  fn={(e) => {
                    setShow(true);
                    divEl.current?.focus();
                  }}
                />
              ) : (
                <Button
                  title={title}
                  text="Add a Comment ..."
                  fn={(e) => {
                    setShowLogin(true);
                  }}
                />
              )}
            </div>
          )}
        </>
      )}
      {showLogin ? (
        <LoginForm cleanUp={() => setShowLogin(false)} show={true} />
      ) : (
        <></>
      )}

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
};

export default AddComment;
