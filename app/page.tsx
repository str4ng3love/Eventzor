import { getServerSession } from "next-auth";
import Authenticate from "./components/Authenticate";
import { options } from "./api/auth/[...nextauth]/options";
import Link from "next/link";
export default async function Home() {
  const session = await getServerSession(options);
  
  console.log(session)
  if (session?.user) {
    return (
      <main className="flex min-h-screen flex-col items-center p-24">
        <h2 className="text-3xl font-bold ">
          <Link className="text-text" href={"/dashboard"}>Dashboard Demo</Link>
          <p>you're in</p>
        </h2>
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h2 className="text-3xl font-bold mb-8">Dashboard Demo</h2>
       
          <Authenticate />
      
      </main>
    );
  }
}
