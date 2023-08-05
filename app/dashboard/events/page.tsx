
import EventBrowser from "@/app/components/dynamic/Events/EventBrowser"
import { Heading2, Heading4 } from "@/app/components/static/Heading"


const page = () => {
  return (
    <>
      <Heading2 text="events" />
      <Heading4 text="Browse and menage events"/>
      <EventBrowser />
    </>
  )
}

export default page