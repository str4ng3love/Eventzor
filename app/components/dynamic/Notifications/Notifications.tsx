"use client";

import { Fragment, useEffect, useState } from "react";
import Icon from "../../static/Icon";
import { FaBell } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import SpinnerMini from "../../static/SpinnerMini";
import { Notification, StatusOrder } from "@prisma/client";
import Button from "../Button";

import Portal from "../../Portal";
import CommentComponent from "../Comment/CommentComponent";

import { useRouter } from "next/navigation";
import { CommentProps } from "@/types/interfaces";
import FormatString from "@/helpers/formatString";

interface NotifProps extends Notification {
  item: { item: string } | null;
  event: { title: string } | null;
  order: { id: string; status: StatusOrder } | null;
  comment: { message: string } | null;
}

const Notifications = () => {
  const [unseen, setUnseen] = useState<{ id: string }[]>([]);
  const [notifications, setNotifications] = useState<NotifProps[] | null>(null);
  const [selectedEl, setSelectedEl] = useState<CommentProps | null>(null);
  const [working, setWorking] = useState(false);
  const [SSEError, setSSEError] = useState(false);
  const router = useRouter();

  const getNotSeenNotifications = async () => {
    try {
      const resp = await fetch("/api/notifications/notseen", {
        cache: "no-store",
      });
      const data = await resp.json();
      const unseenNotifications: { id: string }[] = data.unseenNotifications;
      const setOfUnseen = new Set([...unseen, ...unseenNotifications]);

      const arrayUnseen = Array.from(setOfUnseen);

      return arrayUnseen;
    } catch (error) {
      console.log(error);
    }
  };
  const getComment = async (id: string) => {
    try {
      setWorking(true);
      const resp = await fetch("/api/comments/" + id, { cache: "no-store" });
      const comment = await resp.json();

      setWorking(false);
      return comment.comment;
    } catch (error) {
      setWorking(false);
      console.log(error);
    }
  };

  const getNotifications = async () => {
    try {
      const resp = await fetch("/api/notifications", { cache: "no-store" });
      const notifications = await resp.json();

      return notifications.notifications;
    } catch (error) {
      console.log(error);
    }
  };
  const markAsSeen = async () => {
    try {
      const resp = await fetch("/api/notifications/markAsSeen");
      const data = await resp.json();
      if (data.message) {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const markAllAsRead = async () => {
    try {
      const resp = await fetch("/api/notifications/markAsRead");
      const data = await resp.json();
      if (data.error) {
        console.log(data.error);
      } else {
        setNotifications(await getNotifications());
      }
    } catch (error) {
      console.log(error);
    }
  };
  const markAsRead = async (id: string) => {
    try {
      const resp = await fetch(`/api/notifications/markAsRead/${id}`);
      const data = await resp.json();
      if (data.error) {
        console.log(data.error);
      } else {
        setNotifications(await getNotifications());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const unseenNotifications = await getNotSeenNotifications();
      if (unseenNotifications) setUnseen(unseenNotifications);
    })();
    const eventSource = new EventSource("/api/sse");

    eventSource.onmessage = async (e) => {
      const unseenNotifications = await getNotSeenNotifications();
      if (unseenNotifications) setUnseen(unseenNotifications);
    };
    eventSource.onerror = (e) => {
      setSSEError(true);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);
  useEffect(() => {
    if (SSEError === true) {
      const id = setInterval(async () => {
        const notSeenNotifications = await getNotSeenNotifications();
        if (notSeenNotifications) setUnseen(notSeenNotifications);
      }, 60000);
      return () => clearInterval(id);
    }
  }, [SSEError]);

  return (
    <div className={`relative`}>
      <Menu>
        <Menu.Button
          aria-label="Notifications"
          className={`group flex h-8 w-8 cursor-pointer items-center justify-center transition-transform duration-300 hover:-translate-y-1 hover:scale-105 dark:hover:drop-shadow-white_omni`}
          onClick={async () => {
            setUnseen([]);
            if (notifications === null)
              setNotifications(await getNotifications());
            await markAsSeen();
          }}
        >
          <Icon
            padding=""
            textSize="text-base"
            textColor="group-hover:text-contrast dark:group-hover:text-text transition text-interactive"
            Icon={FaBell}
          />
          {unseen.length > 0 ? (
            <span className="absolute right-0 top-0 flex h-6 w-6 -translate-y-2 translate-x-[1rem] animate-fadeIn items-center justify-center rounded-full bg-secondary text-white">
              {unseen.length}
            </span>
          ) : null}
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
          <div className="absolute right-0 mt-4 flex translate-x-16 flex-col bg-bg shadow-lg dark:ring-2 dark:ring-primary">
            <Menu.Items
              className={`from-bg_sidebar to-bg_interactive h-64 w-[30ch] overflow-x-hidden overflow-y-scroll bg-sidebar dark:bg-gradient-radial sm:w-[40ch] md:w-[50ch] `}
            >
              {notifications ? (
                notifications.map((n, k) => (
                  <Menu.Item
                    as={`div`}
                    className={`cursor-pointer p-1 text-xs transition-all duration-300 hover:bg-link md:text-sm`}
                    key={k}
                  >
                    {n.action === "comment" ? (
                      <div
                        className="overflow-hidden  text-ellipsis whitespace-nowrap"
                        onClick={async () => {
                          setSelectedEl(
                            await getComment(n.commentId as string),
                          );
                          markAsRead(n.id);
                        }}
                      >
                        <span
                          className={`mx-1 inline-block h-1 w-1 rounded-full ${n.read ? "" : "bg-link"}`}
                        ></span>
                        <span>
                          {n.initiator} commented on your{" "}
                          {n.item ? `item ${n.item.item}` : ""}
                          {n.event ? `event "${n.event.title}"` : ""}
                        </span>
                      </div>
                    ) : null}
                    {n.action === "like" ? (
                      <div
                        className="overflow-hidden  text-ellipsis whitespace-nowrap"
                        onClick={async () => {
                          markAsRead(n.id);
                          if (n.comment) {
                            setSelectedEl(
                              await getComment(n.targetCommentId as string),
                            );
                          } else if (n.event) {
                            router.push(`/event/${n.event?.title}`);
                          } else {
                            router.push(`/item/${n.item?.item}`);
                          }
                        }}
                      >
                        <span
                          className={`mx-1 inline-block h-1 w-1 rounded-full ${n.read ? "" : "bg-link"}`}
                        ></span>
                        <span>
                          {n.initiator} liked your{" "}
                          {n.item ? `item "${n.item.item}"` : ""}
                          {n.event ? `event "${n.event.title}"` : ""}
                          {n.comment
                            ? `comment "${FormatString(n.comment?.message as string)}"`
                            : ""}
                        </span>
                      </div>
                    ) : null}
                    {n.action === "dislike" ? (
                      <div
                        className="overflow-hidden  text-ellipsis whitespace-nowrap"
                        onClick={async () => {
                          if (n.comment) {
                            markAsRead(n.id);
                            setSelectedEl(
                              await getComment(n.targetCommentId as string),
                            );
                          } else if (n.event) {
                            markAsRead(n.id);
                            router.push(`/event/${n.event?.title}`);
                          } else {
                            markAsRead(n.id);
                            router.push(`/item/${n.item?.item}`);
                          }
                        }}
                      >
                        <span
                          className={`mx-1 inline-block h-1 w-1 rounded-full ${n.read ? "" : "bg-link"}`}
                        ></span>
                        <span>
                          {n.initiator} disliked your{" "}
                          {n.item ? `item "${n.item.item}"` : ""}
                          {n.event ? `event "${n.event.title}"` : ""}
                          {n.comment
                            ? `comment "${FormatString(n.comment?.message as string)}"`
                            : ""}
                        </span>
                      </div>
                    ) : null}
                    {n.action === "reply" ? (
                      <div
                        className="overflow-hidden  text-ellipsis whitespace-nowrap"
                        onClick={async () => {
                          markAsRead(n.id);
                          setSelectedEl(
                            await getComment(n.targetCommentId as string),
                          );
                        }}
                      >
                        <span
                          className={`mx-1 inline-block h-1 w-1 rounded-full ${n.read ? "" : "bg-link"}`}
                        ></span>
                        <span>
                          {n.initiator} replied to your comment &quot;
                          {FormatString(n.comment?.message as string)}&quot;
                        </span>
                      </div>
                    ) : null}
                    {n.action === "status" ? (
                      <div
                        className="overflow-hidden  text-ellipsis whitespace-nowrap"
                        onClick={async () => {
                          markAsRead(n.id);
                        }}
                      >
                        <span
                          className={`mx-1 inline-block h-1 w-1 rounded-full ${n.read ? "" : "bg-link"}`}
                        ></span>
                        <span>
                          Order ID:
                          {n.orderId ? "[...]" + n.orderId.slice(-8) : "??"} is
                          now{" "}
                          {n.order?.status === "shipping" ? "in shipping" : ""}
                          {n.order?.status === "pendingPayment"
                            ? "awaiting payment"
                            : ""}{" "}
                          {n.order?.status !== "pendingPayment" &&
                          n.order?.status !== "shipping"
                            ? n.order?.status
                            : ""}
                        </span>
                      </div>
                    ) : null}
                  </Menu.Item>
                ))
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <SpinnerMini />
                </div>
              )}
              {notifications !== null && notifications.length === 0 ? (
                <div className="flex h-full items-center justify-center font-semibold">
                  You don&apos;t have any notification
                </div>
              ) : null}
            </Menu.Items>
            <div className="flex justify-center bg-interactive p-4 dark:bg-gradient-to-br dark:from-primary dark:to-slate-900">
              <Button
                text="mark all as read"
                title="mark notifications as read"
                fn={async () => {
                  await markAllAsRead();
                }}
                size="text-xs"
              />
            </div>
          </div>
        </Transition>
      </Menu>
      {selectedEl !== null ? (
        <Portal
          cleanUp={() => setSelectedEl(null)}
          child={
            <CommentComponent
              triggerRefetchFN={async () =>
                setSelectedEl(await getComment(selectedEl.id))
              }
              {...selectedEl}
              author={selectedEl.authorName}
              text={selectedEl.message}
              likes={selectedEl._count.likes}
              dislikes={selectedEl._count.dislikes}
              amountOfReplies={selectedEl._count.children}
              createdAt={new Date(selectedEl.createdAt)}
            />
          }
        />
      ) : null}
      {working ? (
        <Portal
          styled={false}
          child={<SpinnerMini borderSize="border-[12px]" h="h-16" w="w-16" />}
        />
      ) : null}
    </div>
  );
};

export default Notifications;
