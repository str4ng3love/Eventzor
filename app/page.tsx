import { getServerSession } from "next-auth";
import Authenticate from "./components/Authenticate";
import { options } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const session = await getServerSession(options);
  if (session?.user) {
    return (
      <main className="flex min-h-screen flex-col items-center p-24">
        <h2 className="text-3xl font-bold ">Dashboard Demo</h2>
      </main>
    );
  } else {
    return(
          <main className="flex min-h-screen flex-col items-center p-24">
      <h2 className="text-3xl font-bold ">Dashboard Demo</h2>
        <div>
            <Authenticate />
        </div>
    </main>
    )
  }
}
