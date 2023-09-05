"use client";

import { useState } from "react";
import Button from "./Button";
const Test = () => {
  const [currName, setCurrName] = useState("");
  const [currRate, setCurrRate] = useState("");
  const [id, setID] =useState('')

  const getEventsWithPagination = async () => {
    const take = 20;
    const skip = 0;
    console.log(
      encodeURI(
        `/api/events/all?` +
          new URLSearchParams({ take: take.toString(), skip: skip.toString() })
      )
    );
    const resp = await fetch(
      encodeURI(
        `/api/events/all?` +
          new URLSearchParams({ take: take.toString(), skip: skip.toString() })
      )
    );

    const daata = await resp.json();
  };
  const handleCreateCurr = async () => {
try {
  const resp = await fetch('/api/currency', {method:'PATCH', body:JSON.stringify({id:id,name: currName, rate: currRate})})
  // const resp = await fetch('/api/currency')
  const data = await resp.json()
  
  console.log(data)
} catch (error) {
  console.log(error)
}
 
  };
  return (
    <div>
      <form className="p-4 bg-bg text-black">
      <label className="p-2 text-white">ID</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setID(e.currentTarget.value)}
        />
        <label className="p-2 text-white">Name</label>
        <input
          type="text"
          value={currName}
          onChange={(e) => setCurrName(e.currentTarget.value)}
        />
        <label className="p-2 text-white">rate</label>
        <input
          type="number"
          value={currRate}
          onChange={(e) => setCurrRate(e.currentTarget.value)}
        />
      </form>
      <div className="flex p-2">
        <span className="bg-slate-400 m-2 p-2">{currName}</span>
        <span className="bg-slate-400 m-2 p-2">{currRate}</span>
      </div>
      <Button text="submit" fn={(e)=> handleCreateCurr()}/>
    </div>
  );
};

export default Test;
