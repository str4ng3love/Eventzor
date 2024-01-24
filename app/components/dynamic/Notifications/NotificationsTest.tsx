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
        <>  <span>Notifications list:{notifications.length}</span>
           
                <Button text="xxxx" title="xxx" fn={async (e)=>{test()}}/>
            
        </>
    )
}

export default NotificationsTest