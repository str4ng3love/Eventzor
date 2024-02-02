import { prisma } from "@/lib/ConnectPrisma";
import Link from "next/link";
import Informer from "./components/static/Informer";



export default async function Home() {
  const [users, events, items, comments] = await prisma.$transaction(async (tx) => {

    const users = await tx.user.count()
    const events = await tx.event.count({ where: { status: "open" } })
    const items = await tx.marketItem.count()
    const comments = await tx.comment.count({ where: { status: "normal" } })
    return [users, events, items, comments]
  })

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100dvh_-_6rem)]">
      <div className="flex justify-center my-40 w-full items-center">
        <div className="w-[60%]">
          <h1 className="text-5xl font-bold py-5">Welcome to Eventzor</h1>
          <h2 className="text-3xl font-semibold py-4">Your place to <Link className="text-link hover:text-link_active transition-all duration-300 hover:underline" href={'/events'}>find</Link> and <Link className="text-link hover:text-link_active  transition-all duration-300 hover:underline" href={'/dashboard/events'}>post</Link> hot events!</h2>
        </div>
        <div>

        </div>
      </div>
      <div className="flex flex-col">
        <Informer interval={8000} data={[{ target: users, text: "users registered" }, { target: events, text: 'events in database' }, { target: items, text: 'items on market' }, { target: comments, text: "comments left by users" }]} />

      </div>
    </div>


  );
}
