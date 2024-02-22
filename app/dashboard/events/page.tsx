import MyEventBrowser from "@/app/components/dynamic/Events/MyEventBrowser";
import { Heading2, Heading1 } from "@/app/components/static/Heading";




const page = async () => {


  return (

    <div className="flex flex-col pl-10 dark:bg-inherit bg-black/20 min-h-screenReducedBy4p5Rem">
      <Heading1 text="events" />
      <Heading2 text="Browse and manage events" />
      <MyEventBrowser />
    </div>

  );
};

export default page;
