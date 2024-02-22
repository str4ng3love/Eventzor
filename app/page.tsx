import { prisma } from "@/lib/ConnectPrisma";
import Link from "next/link";
import Informer from "./components/static/Informer";
import Button from "./components/dynamic/Button";
import Footer from "./components/static/Footer";



export default async function Home() {
  const [users, events, items, comments] = await prisma.$transaction(async (tx) => {

    const users = await tx.user.count()
    const events = await tx.event.count({ where: { status: "open" } })
    const items = await tx.marketItem.count()
    const comments = await tx.comment.count({ where: { status: "normal" } })
    return [users, events, items, comments]
  })

  return (
    <>
      <div className="flex flex-col items-center justify-start bg-gradient-grid bg-fixed bg-3x3 animate-gridMove after:bg-gradient-grid after:bg-6x6 after:animate-gridMoveInverted after:-z-10 after:min-h-screenReducedBy6Rem  after:block after:content-[''] after:w-full after:absolute after:hue-rotate-30 before:content-[''] before:w-full before:min-h-screenReducedBy6Rem  before:blur-lg before:bg-slate-700/20 before:absolute before:bg-fixed after:bg-fixed">
        <div className="flex justify-center mx-10 w-full items-center min-h-screenReducedBy6Rem after:blur-sm shadow-inner shadow-black">
          <div className="w-[60%]">

            <h1 className="md:text-7xl font-bold py-5 uppercase drop-shadow-white_omni text-5xl">Eventzor</h1>
            <h2 className="ma:text-3xl text-2xl font-semibold py-4 pt-8">Your place to <Link className="text-link hover:text-link_active transition-all duration-300 hover:underline" href={'/events'}>find</Link> and <Link className="text-link hover:text-link_active  transition-all duration-300 hover:underline" href={'/dashboard/events'}>post</Link> hot events!</h2>
            <div className="flex flex-col items-center pt-14">
              <Informer interval={8000} data={[{ target: users, text: "users registered" }, { target: events, text: 'events in database' }, { target: items, text: 'items on market' }, { target: comments, text: "comments left by users" }]} />
            </div>
          </div>
        </div>
        <div className="bg-bg w-full flex justify-center border-y-2 border-black">
          <div className="py-24 flex justify-evenly w-[80%] gap-2 md:flex-row flex-col items-center">

            <span className="py-8">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, inventore.</span>
        
              <Button text="CTA" title="CTA" link="#" setW="w-[10ch]" />
            
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
