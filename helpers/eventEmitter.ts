import EventEmitter from "events";

const emitter = new EventEmitter();

const triggerNotification = async (recipients: (string | undefined)[]) => {
  recipients.map((r) => {
    if (r === undefined) {
      return;
    }

    let eventName = `Notify@${r}`;

    emitter.emit(eventName);
  });
};

export { emitter, triggerNotification };
