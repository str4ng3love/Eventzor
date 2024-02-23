import MyEventBrowser from "@/app/components/dynamic/Events/MyEventBrowser";
import { Heading2, Heading1 } from "@/app/components/static/Heading";

const page = async () => {
  return (
    <div className="flex min-h-screenReducedBy4p5Rem flex-col bg-black/20 pl-10 dark:bg-inherit">
      <Heading1 text="events" />
      <Heading2 text="Browse and manage events" />
      <MyEventBrowser />
    </div>
  );
};

export default page;
