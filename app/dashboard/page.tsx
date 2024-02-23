import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { Heading1 } from "../components/static/Heading";

import CreateNew from "../components/dynamic/CreateNew";
import CheckForStocks from "../components/dynamic/CheckForStocks";

const page = async () => {
  const session = await getServerSession(options);
  const user = session?.user?.name;

  return (
    <div className="flex min-h-screenReducedBy4p5Rem flex-col bg-black/20 dark:bg-inherit">
      <div className="w-full pl-8">
        <Heading1 text={`Hello, ${user}`} />
      </div>
      <CheckForStocks />
      <div className="flex justify-center gap-4 p-8">
        <CreateNew />
      </div>
    </div>
  );
};

export default page;
