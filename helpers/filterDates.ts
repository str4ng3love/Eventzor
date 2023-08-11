import { Event } from "@prisma/client"

const filterDates= (event:Event, dates:{ startDate: string, endDate: string})=>{
    
    return event.startDate.toDateString() >= dates.startDate &&  dates.startDate <= event.startDate.toDateString()
  }

  export {filterDates}