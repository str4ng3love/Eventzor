import { getServerSession } from "next-auth";
import Authenticate from "./components/Authenticate";
import { options } from "./api/auth/[...nextauth]/options";
import Logout from "./components/dynamic/Logout";
import Button from "./components/dynamic/Button";

export default async function Home() {

  const session = await getServerSession(options);

  if (session?.user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h2 className="text-3xl font-bold mb-8 ">Dashboard Demo</h2>
        <div className="flex justify-around p-4 gap-4">
          <Button text="Enter" link="/dashboard" />
          <Logout />
        </div>
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
