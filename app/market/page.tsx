import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

// get market items

const page = async () => {
  const session = await getServerSession(options)

  return (
    <div className="flex flex-col min-h-[calc(100dvh_-_4rem)]">
      <div>sub header</div>
      <div>newest offers</div>
      <div>browser of some kind</div>
    </div>
  );
};

export default page;
