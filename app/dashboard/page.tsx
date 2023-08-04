import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { Heading3, Heading2 } from "../components/static/Heading";

const page = async () => {
  const session = await getServerSession(options);
  const user = session?.user?.name;
  return (
    <div className="">
      <Heading2 text={`Hello, ${user}`} />
      <Heading3 text="overview" />
      <div className="flex justify-between py-8"></div>
    </div>
  );
};

export default page;
