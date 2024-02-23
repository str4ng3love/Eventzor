export const dynamic = "force-dynamic";

import { options } from "../api/auth/[...nextauth]/options";
import Authenticate from "../components/Authenticate";
import Sidebar from "../components/dynamic/Sidebar/Sidebar";
import { getServerSession } from "next-auth";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);
  const user = session?.user;
  if (user) {
    return (
      <main className="flex min-h-screen bg-sidebar pt-16 dark:bg-black">
        <Sidebar />
        <section className="mt-2 min-h-screenReducedBy4p5Rem w-full rounded-smoothLT bg-bg ring-2 ring-slate-600 dark:ring-primary ">
          {children}
        </section>
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black/20 dark:bg-inherit">
        <h2 className="mb-8 text-xl font-bold">
          You need to be authenticated.
        </h2>
        <Authenticate />
      </main>
    );
  }
}
