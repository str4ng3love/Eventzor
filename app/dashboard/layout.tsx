import Sidebar from "../components/static/Sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex bg-bg_sidebar dark:bg-black ">
      <Sidebar />
      <section className="ring-2 ring-slate-600 dark:ring-primary bg-bg w-full mt-4  rounded-smoothLT">
        {children}
      </section>
    </main>
  );
}
