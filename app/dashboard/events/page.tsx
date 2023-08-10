
import EventBrowser from "@/app/components/dynamic/Events/EventBrowser"
import { Heading2, Heading4 } from "@/app/components/static/Heading"


const page = () => {
  return (
    <>
      <div className="flex flex-col pl-10">
      <Heading2 text="events" />
      <Heading4 text="Browse and manage events"/>
      </div>
      <EventBrowser />
    </>
  )
}

export default page