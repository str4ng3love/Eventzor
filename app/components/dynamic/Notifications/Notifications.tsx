'use client'

import { Fragment, useEffect, useState } from "react";
import Icon from "../../static/Icon";
import { FaBell } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import SpinnerMini from "../../static/SpinnerMini";
import { Comment, Notification } from "@prisma/client";
import Button from "../Button";
import { FormatString } from "@/helpers/FormatString";

import Portal from "../../Portal";
import CommentComponent from "../Comment/CommentComponent";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CommentProps extends Comment {
  _count: {
    likes: number, dislikes: number, children: number
  }
}


interface NotifProps extends Notification {
  item: { item: string } | null
  event: { title: string } | null
  order: { id: string } | null
  comment: { message: string } | null
}

const Notifications = () => {
  const [event, setEvent] = useState(0)
  const [notifications, setNotifications] = useState<NotifProps[] | null>(null)
  const [selectedEl, setSelectedEl] = useState<CommentProps | null>(null)
  const [working, setWorking] = useState(false)

  const router = useRouter()

  const getNumberOfUnreadNotifications = async () => {
    try {
      const resp = await fetch('/api/notifications/unread', { cache: "no-store" })
      const amountUnread = await resp.json()
      return amountUnread
    } catch (error) {
      console.log(error)
    }
  }
  const getCommment = async (id: string) => {
    try {
      setWorking(true)
      const resp = await fetch('/api/comment/' + id, { cache: "no-store" })
      const comment = await resp.json()

      setWorking(false)
      return comment.comment
    } catch (error) {
      setWorking(false)
      console.log(error)
    }
  }

  const getNotifications = async () => {
    try {
      const resp = await fetch('/api/notifications', { cache: "no-store" })
      const notifications = await resp.json()

      return notifications.notifications
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    (async () => {
      const { unread } = await getNumberOfUnreadNotifications()
      setEvent(unread)

    })()
    const eventSource = new EventSource('/api/sse')
    eventSource.onopen = (e) => console.log('connection open')
    eventSource.onmessage = (e) => setEvent(prev => prev + 1)
    eventSource.onerror = (e) => eventSource.close()

    return () => {
      eventSource.close()

    }
  }, [])


  return (
    <div className={`group`} onClick={async () => { setEvent(0); if (notifications === null) setNotifications(await getNotifications()) }
    }>



      <Menu >
        <Menu.Button className={`relative h-fit `}>
          <Icon textSize="text-base" textColor="text-text_inactive group:hover:text-white transition-all duration-300 cursor-pointer text-text_inactive " Icon={FaBell} />    {event > 0 ? <span className="absolute bg-secondary flex items-center justify-center rounded-full h-6 w-6 top-0 right-0 translate-y-2 translate-x-[1rem] text-white">
            {event}
          </span> : <></>}
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
          afterLeave={() => setNotifications(null)}
        >
          <div className="absolute flex flex-col bg-bg ring-2 ring-bg_interactive translate-x-[-80%]">
            <Menu.Items className={`w-[50ch] h-64 overflow-y-scroll overflow-x-hidden bg-gradient-radial from-bg_sidebar to-bg_interactive `} >

              {notifications ? notifications.map((n, k) =>

                <Menu.Item as={`div`} className={`p-1 hover:bg-link`} key={k}>
                  {n.action === "comment" ?

                    <div className="overflow-hidden  text-ellipsis whitespace-nowrap" onClick={async () => setSelectedEl(await getCommment(n.commentId as string))}>
                      <span className={`inline-block rounded-full mx-1 h-1 w-1 ${n.read ? "bg-text" : "bg-link"}`}></span>
                      <span>
                        {n.initiator} commented on your {n.item ? `item ${n.item.item}` : ''}{n.event ? `event "${n.event.title}"` : ''}
                      </span>
                    </div>
                    : <></>}
                  {n.action === "like" ?
                   
                      <div className="overflow-hidden  text-ellipsis whitespace-nowrap" onClick={async () => {
                        if (n.comment) {
                          setSelectedEl(await getCommment(n.targetCommentId as string))
                        } else if(n.event){
                         router.push(`/event/${n.event?.title}`)
                        } else {
                          router.push(`/item/${n.item?.item}`)
                        }
                      }}>
                        <span className={`inline-block rounded-full mx-1 h-1 w-1 ${n.read ? "" : "bg-link"}`}></span>
                        <span>
                          {n.initiator} liked your {n.item ? `item "${n.item.item}"` : ''}{n.event ? `event "${n.event.title}"` : ''}{n.comment ? `comment "${FormatString(n.comment?.message as string)}"` : ""}
                        </span>
                      </div>
                
                    : <></>}
                  {n.action === "dislike" ?
                 

                      <div className="overflow-hidden  text-ellipsis whitespace-nowrap" onClick={async () => {
                        if (n.comment) {
                          setSelectedEl(await getCommment(n.targetCommentId as string))
                        } else if(n.event){
                          router.push(`/event/${n.event?.title}`)
                         } else {
                           router.push(`/item/${n.item?.item}`)
                         }
                      }}>
                        <span className={`inline-block rounded-full mx-1 h-1 w-1 ${n.read ? "bg-text" : "bg-link"}`}></span>
                        <span >
                          {n.initiator} disliked your {n.item ? `item "${n.item.item}"` : ''}{n.event ? `event "${n.event.title}"` : ''}{n.comment ? `comment "${FormatString(n.comment?.message as string)}"` : ""}
                        </span>
                      </div>
               
                    : <></>}
                  {n.action === "reply" ?


                    <div className="overflow-hidden  text-ellipsis whitespace-nowrap" onClick={async () => setSelectedEl(await getCommment(n.targetCommentId as string))}>
                      <span className={`inline-block rounded-full mx-1 h-1 w-1 ${n.read ? "bg-text" : "bg-link"}`}></span>
                      <span>
                        {n.initiator} replied to your comment "{FormatString(n.comment?.message as string)}"
                      </span>
                    </div>

                    : <></>}

                </Menu.Item>)

                : <div className="w-full h-full flex justify-center items-center">
                  <SpinnerMini />
                </div>}
              {
                notifications !== null && notifications.length === 0 ? <div className="flex h-full font-semibold items-center justify-center">You don't have any notification</div> : <></>
              }



            </Menu.Items>
            <div className="p-4 bg-gradient-to-br from-primary to-slate-900 flex justify-center">
              <Button text="mark all as read" title="mark notifications as read" fn={() => { }} size="text-xs" />
            </div>
          </div>

        </Transition>
      </Menu>
      {selectedEl !== null ? <Portal cleanUp={() => setSelectedEl(null)} child={<CommentComponent triggerRefetchFN={async () => setSelectedEl(await getCommment(selectedEl.id))} {...selectedEl} author={selectedEl.authorName} text={selectedEl.message} likes={selectedEl._count.likes} dislikes={selectedEl._count.dislikes} amountOfReplies={selectedEl._count.children} createdAt={new Date(selectedEl.createdAt)} />} /> : <></>}
      {working ? <Portal styled={false} child={<SpinnerMini borderSize="border-[12px]" h="h-16" w="w-16" />} /> : <></>}
    </div >
  );
};

export default Notifications;