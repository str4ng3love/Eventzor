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
  const title = decodeURIComponent(params.slug);
  const event = await getEvent(decodeURI(title));
  if (event !== null) {
    return (
      <main className="flex min-h-screenReducedBy6Rem flex-col items-center pt-20">
        <div className="grid w-full grid-cols-1 gap-2 p-4 transition-all duration-300 md:grid-cols-3 lg:w-[80%] lg:gap-4">
          <div className="flex flex-col rounded-md bg-interactive p-4 shadow-lg dark:bg-black/20 dark:shadow-none md:col-span-2 md:row-span-2">
            <h2 className="p-4 text-2xl font-bold">{event.title}</h2>
            <div className="my-8 flex flex-col p-2">
              <span>{event.eventDate.toUTCString().slice(0, -7)}&nbsp;GMT</span>
              <span>{event.location}</span>
            </div>

            <ImageBrowser images={event.images} />
          </div>

          <div className="flex flex-col justify-start rounded-md bg-interactive p-4 shadow-lg dark:bg-black/20 dark:shadow-none md:col-span-3 md:row-start-3">
            <p className="indent-4">{event.description}</p>
          </div>
          <div className="flex h-fit flex-col justify-center place-self-auto rounded-md bg-interactive p-4 shadow-lg dark:bg-black/20 dark:shadow-none sm:mx-20 md:col-start-3 md:row-start-1 md:mx-0">
            <div className=" rounded-t-md bg-primary p-2 ring-2 ring-primary">
              <div className="text-interactive_text flex justify-between p-1 dark:text-text">
                <span>Price&nbsp;:</span>
                <PriceDisplay price={event.price} />
              </div>
              <div className="text-interactive_text flex justify-between p-1 dark:text-text">
                <span>Tickets&nbsp;:</span>
                <DisplayStock
                  amount={event.tickets}
                  amountSold={event.ticketsSold}
                />
              </div>

              <AddToCart
                id={event.id}
                price={event.price}
                type={"event"}
                item={event.title}
                amountLeft={event.tickets - event.ticketsSold}
                saleEnded={
                  event.closingDate > new Date(Date.now()) ? false : true
                }
              />
            </div>
            <div className="mb-7 flex flex-col rounded-md rounded-t-none p-2 text-sm shadow-lg ring-2 ring-primary dark:shadow-none md:text-base">
              <div
                title="Tickets are being sold until this date"
                className="flex justify-between p-1"
              >
                <span>Sold until&nbsp;:&nbsp;</span>
                <span>
                  {event.closingDate > new Date(Date.now())
                    ? event.closingDate.toUTCString().slice(0, -7) + ` GMT`
                    : "Sale over"}
                </span>
              </div>
              <div
                title="Date of event happening"
                className="flex justify-between p-1"
              >
                <span>Event Date&nbsp;:&nbsp;</span>
                <span>
                  {event.eventDate.toUTCString().slice(0, -7)}&nbsp;GMT
                </span>
              </div>
              <div
                title="Organizer's profile"
                className="flex justify-between p-1"
              >
                <span>Organizer&nbsp;:&nbsp;</span>
                <span className="overflow-hidden text-ellipsis transition-all duration-300 hover:text-link">
                  <Link href={`/users/${event.organizerName}`}>
                    {event.organizerName}
                  </Link>
                </span>
              </div>
            </div>

            <LikeAndDislike
              eventId={event.id}
              amountOfLikes={event._count.likes}
              amountOfDislikes={event._count.dislikes}
            />
          </div>
        </div>
        <Comments eventId={event.id} itemId={null} />
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screenReducedBy6Rem flex-col items-center justify-center gap-2 p-20">
        <Heading2 text={title} />
        <Heading3 text="event not found" />
        <Button
          title="Go back to Events"
          text="go back to Events"
          link="/events"
        />
      </main>
    );
  }
};

export default page;
