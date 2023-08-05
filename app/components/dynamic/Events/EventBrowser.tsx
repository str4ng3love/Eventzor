

import AddNewEvent from "./AddNewEvent"
import {prisma} from '../../../../lib/ConnectPrisma'

const getEvents = async()=>{
  const events = await prisma.event.findMany()
  return {
    events,
    revalidate: 60
  }
}


const EventBrowser = async () => {
  const {events} = await getEvents()
  return (
    <div>
        <AddNewEvent />
        {events ? events.map(event=> (<p>{event.title}</p>)):<></>}
    </div>
  )
}

export default EventBrowser