import Button from "@/app/components/dynamic/Button";
import { Heading2, Heading3 } from "@/app/components/static/Heading";

import getEvent from "@/helpers/getEvent";
import ImageBrowser from "@/app/components/dynamic/ImageBrowser";
import Link from "next/link";
import AddToCart from "@/app/components/dynamic/ShoppingCart/AddToCart";
import PriceDisplay from "@/app/components/static/PriceDisplay";
import Comments from "@/app/components/dynamic/Comment/Comments";
import LikeAndDislike from "@/app/components/dynamic/LikeAndDislike";
import DisplayStock from "@/app/components/static/DisplayStock";

const page = async ({ params }: { params: { slug: string } }) => {
  const title = decodeURIComponent(params.slug)

  const event = await getEvent(decodeURI(title));
  if (event !== null) {

    return (
      <main className="flex flex-col items-center min-h-[calc(100dvh_-_6rem)] pt-20">
        <div className="grid grid-cols-3 justify-between lg:w-[80%] lg:gap-4 gap-2 w-full p-4 transition-all duration-300 ">
          <div className="p-4 flex flex-col rounded-md bg-bg_interactive dark:bg-black/20 col-span-2 row-span-2 ">
            <h2 className="p-4 font-bold text-2xl">{event.title}</h2>
            <div className="flex flex-col p-2 my-8">
              <span>{event.eventDate.toUTCString().slice(0, -7)}&nbsp;GMT</span>
              <span>{event.location}</span>
            </div>

            <ImageBrowser images={event.images} />
          </div>
      
          <div className="p-4 flex flex-col justify-start rounded-md bg-bg_interactive dark:bg-black/20 row-start-3 col-span-3">
            <p className="indent-4">{event.description}</p>
          </div>
          <div className="p-4 flex flex-col justify-start rounded-md bg-bg_interactive dark:bg-black/20 h-fit row-start-1 col-start-3 self-start max-w-sm">
            <div className=" bg-primary ring-2 ring-primary rounded-t-md p-2">
              <div className="flex justify-between p-1 text-interactive_text dark:text-text">
                <span>Price&nbsp;:</span>
                <PriceDisplay price={event.price} />
              </div>
              <div className="flex justify-between p-1 text-interactive_text dark:text-text">
                <span>Tickets&nbsp;:</span>
                <DisplayStock amount={event.tickets} amountSold={event.ticketsSold} />
              </div>

              <AddToCart id={event.id} price={event.price} type={'event'} item={event.title} amountLeft={event.tickets} saleEnded={event.closingDate > new Date(Date.now())? false : true}/>
            </div>
            <div className="flex flex-col ring-2 rounded-t-none ring-primary rounded-md p-2 text-sm md:text-base mb-7">
              <div title="Tickets are being sold until this date" className="flex justify-between p-1">
                <span>Sold until&nbsp;:&nbsp;</span>
                <span>
                  {event.closingDate > new Date(Date.now()) ? event.closingDate.toUTCString().slice(0, -7)+` GMT`: "Sale over"}
                </span>
              </div>
              <div title="Date of event happening" className="flex justify-between p-1">
                <span>Event Date&nbsp;:&nbsp;</span>
                <span>
                  {event.eventDate.toUTCString().slice(0, -7)}&nbsp;GMT
                </span>
              </div>
              <div title="Organizer's profile" className="flex justify-between p-1">
                <span>Organizer&nbsp;:&nbsp;</span>
                <span className="hover:text-link transition-all duration-300 overflow-hidden text-ellipsis">
                  <Link href={`/users/${event.organizerName}`}>{event.organizerName}</Link>
                </span>
              </div>
            </div>
          
            <LikeAndDislike eventId={event.id} amountOfLikes={event._count.likes} amountOfDislikes={event._count.dislikes} />
         
          </div>
        </div>
        <Comments eventId={event.id} itemId={null} />
      </main>
    );
  } else {
    return (
      <main className="flex flex-col justify-center gap-2 items-center min-h-[calc(100dvh_-_4rem)] p-20">

        <Heading2 text={title} />
        <Heading3 text="event not found" />
        <Button title="Go back to Events" text="go back to Events" link="/events" />
      </main>
    );
  }
};

export default page;
