"use client";
import ButtonWithIcon from "../ButtonWithIcon";
import { BiLike, BiDislike } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import Button from "../Button";

interface Props {
  title: string;
  eventId?: string;
  author?: string;
  reply?: boolean;
  parentId?: string;
}
const AddComment = ({
  eventId,
  author,
  reply = false,
  parentId,
  title,
}: Props) => {
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");

  const handleCreate = async () => {
    try {
      const resp = await fetch("/api/comment", {
        method: "POST",
        body: JSON.stringify({
          event: eventId,
          comment: comment,
          author: author,
        }),
      });
      const data = await resp.json();

    } catch (error) {
      console.log(error);
    }
  };
  const handleCreateReply = async () => {
    try {
      console.log(comment)
      const resp = await fetch("/api/comment", {
        method: "POST",
        body: JSON.stringify({
          comment: comment,
          parentId: parentId
        }),
      });
      const data = await resp.json();
      //todo notification or optimistic mount

      console.log(data);
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
        <div className={`w-full px-4 ${reply? "border-t-2 border-primary pt-4 border-dashed mt-4": ""}`}>
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
            className={`flex items-center ${
              reply ? "justify-between" : "justify-end "
            } gap-2`}
          >
            {reply ? (
              <div className="p-2 flex gap-2">
                <ButtonWithIcon
                  size="1em"
                  Icon={BiLike}
                  bgColor="bg-transparent"
                  title="Like"
                  fn={() => {}}
                />
                <ButtonWithIcon
                  size="1em"
                  Icon={BiDislike}
                  bgColor="bg-transparent"
                  title="Dislike"
                  fn={() => {}}
                />
              </div>
            ) : (
              <></>
            )}
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
              <ButtonWithIcon
                size="1em"
                Icon={BiLike}
                bgColor="bg-transparent"
                title="Like"
                fn={() => {}}
              />
              <ButtonWithIcon
                size="1em"
                Icon={BiDislike}
                bgColor="bg-transparent"
                title="Dislike"
                fn={() => {}}
              />
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
            </>
          ) : (
            <div className="flex items-center my-4 justify-center">
              <Button
                title={title}
                text="Add a Comment ..."
                fn={(e) => {
                  setShow(true);
                  divEl.current?.focus();
                }}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AddComment;
