
import { Heading1, Heading2 } from "../../components/static/Heading"
import MyItemsBrowser from "@/app/components/dynamic/Market/MyItemsBrowser";


const page = async () => {
  

  return (
    <>
      <div className="flex flex-col pl-10">
        <Heading1 text="items" />
        <Heading2 text="Browse and menage items" />
      </div>
      <MyItemsBrowser  />
    </>
  );
};

export default page ;
