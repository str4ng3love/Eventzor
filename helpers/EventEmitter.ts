import EventEmitter from "events";

const emitter = new EventEmitter

const TriggerNotification = (recipients: string | (string | undefined)[]): void => {
    console.log('running')
    console.log(typeof recipients === "string")
    typeof recipients === "string" ? emitter.emit('Notify', { recipient: recipients })
        :
        recipients.map(r => {
            if (r === undefined) {
                return
            }
            emitter.emit("Notify", { recipient: r })
        })
}




export { emitter, TriggerNotification }