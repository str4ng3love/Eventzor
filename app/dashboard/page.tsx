
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";



const page = async () => {
  const session = await getServerSession(options);
  const user = session?.user?.name
  return (
   <div className="">
      yol yol yol
   </div>
  )
}

export default page