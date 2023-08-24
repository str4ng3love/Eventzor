import { options } from "../api/auth/[...nextauth]/options";
import Authenticate from "../components/Authenticate";
import Button from "../components/dynamic/Button";
import Sidebar from "../components/static/Sidebar/Sidebar";
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
      <main className="flex bg-bg_sidebar dark:bg-black h-[calc(100dvh_-_4rem)]">
        <Sidebar />
        <section className="ring-2 ring-slate-600 dark:ring-primary bg-bg w-full mt-2  rounded-smoothLT">
          {children}
        </section>
      </main>
    );
  } else {
    return (
      <main className="flex flex-col justify-center items-center  h-[calc(100dvh_-_4rem)]">
        <h2 className="text-xl font-bold mb-8">You need to be authenticated.</h2>
        <Authenticate />
      </main>
    );
  }
}
