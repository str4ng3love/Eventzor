


export const getIDType = (commentId:string|undefined, eventId:string|undefined,itemId:string|undefined )=>{
    let urlPart = "";
    let id='';
    if (typeof commentId !== "undefined") {
      urlPart = Object.keys({ commentId })[0].slice(0, -2);
      id = commentId;
    }
    if (typeof eventId !== "undefined") {
      urlPart = Object.keys({ eventId })[0].slice(0, -2);
      id = eventId;
    }
    if (typeof itemId !== "undefined") {
      urlPart = Object.keys({ itemId })[0].slice(0, -2);
      id = itemId;
    }

    return {urlPart, id}
}