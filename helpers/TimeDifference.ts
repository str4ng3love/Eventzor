export default function timeDifference(now:number, date:number){
    const seconds = Math.floor((now-date) /1000)
    let interval
    interval = seconds / 31104000
    if(interval > 1 ){
      return Math.floor(interval) + " years ago" 
    }
    interval = seconds / 2592000
    if(interval > 1 ){
      return Math.floor(interval) + " months ago" 
    }
    interval = seconds / 604800
    if(interval > 1 ){
      return Math.floor(interval) + " weeks ago" 
    }
    interval = seconds / 86400
    if(interval > 1 ){
      return Math.floor(interval) + " days ago" 
    }
    interval = seconds / 3600
    if(interval > 1 ){
      return Math.floor(interval) + " hours ago" 
    }
    interval = seconds / 60
    if(interval > 1 ){
      return Math.floor(interval) + " minutes ago" 
    }
    return Math.floor(seconds) + " seconds ago" 
  }