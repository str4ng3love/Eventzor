'use client'

import { Fragment, useEffect, useState } from "react";
import Icon from "../../static/Icon";
import { FaBell } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import SpinnerMini from "../../static/SpinnerMini";
import { Notification, StatusOrder } from "@prisma/client";
import Button from "../Button";
import { FormatString } from "@/helpers/FormatString";

import Portal from "../../Portal";
import CommentComponent from "../Comment/CommentComponent";

import { useRouter } from "next/navigation";
import { CommentProps } from "@/types/interfaces";



interface NotifProps extends Notification {
  item: { item: string } | null
  event: { title: string } | null
  order: { id: string, status: StatusOrder } | null
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
  const getComment = async (id: string) => {
    try {
      setWorking(true)
      const resp = await fetch('/api/comments/' + id, { cache: "no-store" })
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
  const markAllAsRead = async () => {
    try {
      const resp = await fetch('/api/notifications/markAsRead')
      const data = await resp.json()
      if (data.error) {
        console.log(data.error)
      } else {
        setNotifications(await getNotifications())
      }
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

    eventSource.onmessage = (e) => { setEvent(prev => prev + 1) }
    eventSource.onerror = (e) => eventSource.close()

    return () => {
      eventSource.close()

    }
  }, [])


  return (
    <div className={`relative`} >



      <Menu >
        <Menu.Button className={`group h-8 w-8 flex justify-center items-center cursor-pointer hover:scale-105 hover:-translate-y-1 transition-transform duration-300`}
          onClick={async () => { setEvent(0); if (notifications === null) setNotifications(await getNotifications()) }}
        >
          <Icon padding="" textSize="text-base" textColor="group-hover:text-text transition-all duration-300 text-text_inactive" Icon={FaBell} />
          {event > 0 ?
            <span className="absolute bg-secondary flex items-center justify-center rounded-full h-6 w-6 top-0 right-0 -translate-y-2 translate-x-[1rem] text-white">
              {event}
            </span> : null}
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
          <div className="absolute flex flex-col bg-bg ring-2 ring-bg_interactive right-0 mt-4 translate-x-16">
            <Menu.Items className={`md:w-[50ch] sm:w-[40ch] w-[30ch] h-64 overflow-y-scroll overflow-x-hidden bg-gradient-radial from-bg_sidebar to-bg_interactive `} >

              {notifications ? notifications.map((n, k) =>

                <Menu.Item as={`div`} className={`p-1 hover:bg-link cursor-pointer transition-all duration-300 md:text-sm text-xs`} key={k}>
                  {n.action === "comment" ?

                    <div className="overflow-hidden  text-ellipsis whitespace-nowrap" onClick={async () => setSelectedEl(await getComment(n.commentId as string))}>
                      <span className={`inline-block rounded-full mx-1 h-1 w-1 ${n.read ? "" : "bg-link"}`}></span>
                      <span>
                        {n.initiator} commented on your {n.item ? `item ${n.item.item}` : ''}{n.event ? `event "${n.event.title}"` : ''}
                      </span>
                    </div>
                    : null}
                  {n.action === "like" ?

                    <div className="overflow-hidden  text-ellipsis whitespace-nowrap" onClick={async () => {
                      if (n.comment) {
                        setSelectedEl(await getComment(n.targetCommentId as string))
                      } else if (n.event) {
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

                    : null}
                  {n.action === "dislike" ?


                    <div className="overflow-hidden  text-ellipsis whitespace-nowrap" onClick={async () => {
                      if (n.comment) {
                        setSelectedEl(await getComment(n.targetCommentId as string))
                      } else if (n.event) {
                        router.push(`/event/${n.event?.title}`)
                      } else {
                        router.push(`/item/${n.item?.item}`)
                      }
                    }}>
                      <span className={`inline-block rounded-full mx-1 h-1 w-1 ${n.read ? "" : "bg-link"}`}></span>
                      <span >
                        {n.initiator} disliked your {n.item ? `item "${n.item.item}"` : ''}{n.event ? `event "${n.event.title}"` : ''}{n.comment ? `comment "${FormatString(n.comment?.message as string)}"` : ""}
                      </span>
                    </div>

                    : null}
                  {n.action === "reply" ?


                    <div className="overflow-hidden  text-ellipsis whitespace-nowrap" onClick={async () => setSelectedEl(await getComment(n.targetCommentId as string))}>
                      <span className={`inline-block rounded-full mx-1 h-1 w-1 ${n.read ? "" : "bg-link"}`}></span>
                      <span>
                        {n.initiator} replied to your comment &quot;{FormatString(n.comment?.message as string)}&quot;
                      </span>
                    </div>

                    : null}
                  {n.action === "status" ?


                    <div className="overflow-hidden  text-ellipsis whitespace-nowrap" onClick={async () => { }}>
                      <span className={`inline-block rounded-full mx-1 h-1 w-1 ${n.read ? "" : "bg-link"}`}></span>
                      <span>
                        Order ID:{n.orderId ? "[...]" + n.orderId.slice(-8) : "??"} is now {n.order?.status === "shipping" ? "in shipping" : ""}{n.order?.status === "pendingPayment" ? "awaiting payment" : ""} {n.order?.status !== "pendingPayment" && n.order?.status !== "shipping" ? n.order?.status : ""}
                      </span>
                    </div>

                    : null}

                </Menu.Item>)

                : <div className="w-full h-full flex justify-center items-center">
                  <SpinnerMini />
                </div>}
              {
                notifications !== null && notifications.length === 0 ? <div className="flex h-full font-semibold items-center justify-center">You don&apos;t have any notification</div> : null
              }



            </Menu.Items>
            <div className="p-4 bg-gradient-to-br from-primary to-slate-900 flex justify-center">
              <Button text="mark all as read" title="mark notifications as read" fn={async () => { await markAllAsRead() }} size="text-xs" />
            </div>
          </div>

        </Transition>
      </Menu>
      {selectedEl !== null ?
        <Portal cleanUp={() => setSelectedEl(null)} child={<CommentComponent triggerRefetchFN={async () => setSelectedEl(await getComment(selectedEl.id))} {...selectedEl} author={selectedEl.authorName} text={selectedEl.message} likes={selectedEl._count.likes} dislikes={selectedEl._count.dislikes} amountOfReplies={selectedEl._count.children} createdAt={new Date(selectedEl.createdAt)} />} /> : null}
      {working ? <Portal styled={false} child={<SpinnerMini borderSize="border-[12px]" h="h-16" w="w-16" />} /> : null}
    </div >
  );
};

export default Notifications;