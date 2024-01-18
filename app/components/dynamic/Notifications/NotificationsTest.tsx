'use client'

import { useEffect, useState } from "react"
import SpinnerMini from "../../static/SpinnerMini"
import { Notification } from "@prisma/client"
import Button from "../Button"

const NotificationsTest = () => {
    const [notifications, setNotifications] = useState<Notification[] | null>(null)

    const test = async () =>{
        await fetch('/api/test')
    }
    const getNotifications = async () => {
        try {
            const resp = await fetch('/api/notifications', { cache: "no-store" })
            const notifications = await resp.json()
            return notifications
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {

        (async () => {

            const { notifications } = await getNotifications()

            setNotifications(notifications)
        })()
    }, [])

    if (notifications === null) {
        return (
            <SpinnerMini borderSize="border-4" h="h-4" w="w-4" />
        )
    }
    return (
        <>  <span>Notifications list:</span>
            {notifications ?
                <div>{notifications.map((n, k) =>
                    <div key={k}>
                        {!n.markedAsDeleted ?
                            <div key={k}>
                                <span>{n.commentId || n.marketItemId || n.orderId}&nbsp;{n.action}&nbsp;by&nbsp;{n.initiator}&nbsp;{n.markedAsDeleted ? "deleted" : ""}</span>
                            </div> : <></>}
                    </div>)}
                </div> : <></>}
                <Button text="xxxx" title="xxx" fn={async (e)=>{test()}}/>
        </>
    )
}

export default NotificationsTest