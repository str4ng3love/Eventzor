'use client'

import { useEffect, useState } from "react";
import Icon from "../../static/Icon";
import { FaBell } from "react-icons/fa";

const Notifications = () => {
  const [event, setEvent] = useState(0)


  useEffect(() => {
    let eventSource = new EventSource('/api/sse')


    eventSource.onopen = (e) => console.log('connection open')
    eventSource.onmessage = (e) => setEvent(prev => prev + 1)
    eventSource.onerror= (e) => eventSource.close()    

    return () => {
      eventSource.close()
      

    }
  }, [])

  return (
    <div className={`relative group flex items-center justify-start w-full cursor-pointer text-text_inactive `} onClick={()=>setEvent(0)}>
      {event > 0 ? <span className="absolute bg-secondary flex items-center justify-center rounded-full h-6 w-6 top-0 right-0 -translate-y-[0.5rem] translate-x-[1rem] text-white">
        {event}
      </span> : <></>}
      <Icon textSize="text-base" textColor="text-text_inactive group-hover:text-white transition-all duration-300" Icon={FaBell} />
    </div>
  );
};

export default Notifications;