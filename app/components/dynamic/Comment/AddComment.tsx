"use client";

import { useEffect, useRef, useState } from "react";
import Button from "../Button";

interface Props {
  eventId:string;
  author:string;
}
const AddComment = ({eventId, author}:Props) => {
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");


  const handleCreate = async () =>{
    try {
      const resp = await fetch('/api/comment', {method:"POST", body:JSON.stringify({event:eventId, comment: comment, author: author})})
      const data = await resp.json()
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  const divEl = useRef<HTMLInputElement>(null);
  useEffect(()=>{
    divEl.current?.focus()
  }, [show])
  return (
    <>
      {show ? (
        <>
          <h4 className="p-2">Leave a Comment</h4>
          <div
            ref={divEl}
            onInput={(e) => setComment(e.currentTarget.innerHTML)}
            onPaste={(e) => setComment(e.currentTarget.innerHTML)}
            className="p-4 resize-none text-text_inactive my-8 bg-interactive_text transition-all 500ms break-all ring-2 ring-primary rounded-md"
            placeholder="Add a comment..."
            contentEditable
          />

          <div className="flex items-center justify-end gap-2">
            <Button
              text="Cancel"
              bgColor="bg-secondary"
              fn={(e) => {
                setShow(false);
              }}
            />
            <Button text="Add" fn={() => {handleCreate()}} />
          </div>
        </>
      ) : (
        <div className="flex items-center my-4 justify-center">

        <Button
          text="Add a Comment ..."
          fn={(e) => {
              setShow(true);
              divEl.current?.focus();
            }}
            />
            </div>
      )}
    </>
  );
};

export default AddComment;
