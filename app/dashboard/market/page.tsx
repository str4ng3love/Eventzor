
import { Heading1, Heading2 } from "../../components/static/Heading"
import MyItemsBrowser from "@/app/components/dynamic/Market/MyItemsBrowser";


const page = async () => {


  return (

    <div className="flex flex-col pl-10 dark:bg-inherit bg-black/20 min-h-screenReducedBy4p5Rem">
      <Heading1 text="items" />
      <Heading2 text="Browse and menage items" />
      <MyItemsBrowser />
    </div>

  );
};

export default page;
