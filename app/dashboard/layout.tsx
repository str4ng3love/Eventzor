import { options } from "../api/auth/[...nextauth]/options";
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
      <main className="flex bg-bg_sidebar dark:bg-black">
        <Sidebar />
        <section className="ring-2 ring-slate-600 dark:ring-primary bg-bg w-full mt-4  rounded-smoothLT">
          {children}
        </section>
      </main>
    );
  } else {
    return (
      <main className="flex bg-bg_sidebar dark:bg-black min-h-screen flex-col justify-center items-center">
        <h2 className="text-xl font-bold mb-8">You need to be authenticated.</h2>
        <Button text="Home Page" link="/"/>
      </main>
    );
  }
}
