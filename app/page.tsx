import { prisma } from "@/lib/ConnectPrisma";
import Link from "next/link";
import Informer from "./components/static/Informer";
import Button from "./components/dynamic/Button";
import Footer from "./components/static/Footer";

export default async function Home() {
  const [users, events, items, comments] = await prisma.$transaction(
    async (tx) => {
      const users = await tx.user.count();
      const events = await tx.event.count({ where: { status: "open" } });
      const items = await tx.marketItem.count();
      const comments = await tx.comment.count({ where: { status: "normal" } });
      return [users, events, items, comments];
    },
  );

  return (
    <>
      <div className="flex animate-gridMove flex-col items-center justify-start bg-gradient-grid bg-3x3 bg-fixed before:absolute before:min-h-screenReducedBy6Rem before:w-full before:bg-slate-700/20 before:bg-fixed  before:blur-lg before:content-[''] after:absolute after:-z-10 after:block after:min-h-screenReducedBy6Rem after:w-full after:animate-gridMoveInverted  after:bg-gradient-grid after:bg-6x6 after:bg-fixed after:hue-rotate-30 after:content-['']">
        <div className="mx-10 flex min-h-screenReducedBy6Rem w-full items-center justify-center shadow-inner shadow-black after:blur-sm">
          <div className="w-[60%]">
            <h1 className="py-5 text-5xl font-bold uppercase drop-shadow-white_omni md:text-7xl">
              Eventzor
            </h1>
            <h2 className="ma:text-3xl py-4 pt-8 text-2xl font-semibold">
              Your place to find and post hot events!
            </h2>

            <div className="flex flex-col items-center pt-14">
              <Informer
                interval={8000}
                data={[
                  { target: users, text: "users registered" },
                  { target: events, text: "events in database" },
                  { target: items, text: "items on market" },
                  { target: comments, text: "comments left by users" },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center border-y-2 border-black bg-bg">
          <div className="flex w-[80%] flex-col items-center justify-evenly gap-2 py-24 md:flex-row">
            <span className="py-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab,
              inventore.
            </span>

            <Button text="CTA" title="CTA" link="#" setW="w-[10ch]" />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
