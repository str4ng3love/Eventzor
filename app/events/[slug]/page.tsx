import Button from "@/app/components/dynamic/Button";
import { Heading2, Heading3 } from "@/app/components/static/Heading";

import getEvent from "@/helpers/getEvent";
import ImageBrowser from "@/app/components/dynamic/ImageBrowser";

const page = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;
  const { event } = await getEvent(decodeURI(slug));

  if (event !== null) {
    return (
      <main className="flex flex-col items-center min-h-[calc(100dvh_-_4rem)]">
        <div className="flex justify-between w-[80%] gap-2">
          <div className="p-2 my-2 flex flex-col grow-[3] rounded-md bg-bg_interactive">
            <h2 className="p-4 font-bold text-2xl">{event.title}</h2>
           <div className="flex flex-col p-2 my-8">
            <span>{event.eventDate.toUTCString().slice(0, -7)}&nbsp;GMT</span>
            <span>{event.location}</span>
           </div>
            <ImageBrowser images={event.images}/>
            <p className="my-8 indent-4">{event.description}</p>
          </div>
          <div className="p-2 my-2 flex flex-col grow-[2] rounded-md bg-bg_interactive">
            <div >buy tickets compoennt here</div>
            <span>date</span>
            <span>date2</span>
            <span>price </span>
            <span>other stuff</span>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main className="flex flex-col justify-center gap-2 items-center min-h-[calc(100dvh_-_4rem)]">
        <Heading2 text={`${decodeURI(slug)}`} />
        <Heading3 text="event not found" />
        <Button text="go back" link="/events" />
      </main>
    );
  }
};

export default page;
