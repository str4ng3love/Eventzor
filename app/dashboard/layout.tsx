export const dynamic = 'force-dynamic'

import { options } from "../api/auth/[...nextauth]/options";
import Authenticate from "../components/Authenticate";
import Sidebar from "../components/dynamic/Sidebar/Sidebar";
import {getServerSession} from "next-auth";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);
  const user = session?.user;
  if (user) {
    return (
      <main className="flex bg-sidebar dark:bg-black min-h-screen pt-16">
        <Sidebar />
        <section className="ring-2 ring-slate-600 dark:ring-primary bg-bg w-full mt-2 rounded-smoothLT min-h-screenReducedBy4p5Rem ">
          {children}
        </section>
      </main>
    );
  } else {
    return (
      <main className="flex flex-col justify-center items-center min-h-screen bg-black/20 dark:bg-inherit">
        <h2 className="text-xl font-bold mb-8">You need to be authenticated.</h2>
        <Authenticate />
      </main>
    );
  }
}
