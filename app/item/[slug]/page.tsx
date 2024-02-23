import Button from "@/app/components/dynamic/Button";
import { Heading2, Heading3 } from "@/app/components/static/Heading";

import ImageBrowser from "@/app/components/dynamic/ImageBrowser";
import Link from "next/link";
import AddToCart from "@/app/components/dynamic/ShoppingCart/AddToCart";
import PriceDisplay from "@/app/components/static/PriceDisplay";
import Comments from "@/app/components/dynamic/Comment/Comments";
import getItem from "@/helpers/getIItem";
import LikeAndDislike from "@/app/components/dynamic/LikeAndDislike";
import DisplayStock from "@/app/components/static/DisplayStock";

const page = async ({ params }: { params: { slug: string } }) => {
  const name = decodeURIComponent(params.slug);
  const item = await getItem(decodeURI(name));
  if (item !== null) {
    return (
      <main className="flex min-h-screenReducedBy6Rem flex-col items-center pt-20">
        <div className="grid w-full grid-cols-1 gap-2 p-4 transition-all duration-300 md:grid-cols-3 lg:w-[80%] lg:gap-4">
          <div className="flex flex-col rounded-md bg-interactive p-4 shadow-lg dark:bg-black/20 dark:shadow-none md:col-span-2 md:row-span-2">
            <h2 className="p-4 text-2xl font-bold">{item.item}</h2>
            <ImageBrowser images={item.images} />
          </div>
          <div className="flex flex-col justify-start rounded-md bg-interactive p-4 shadow-lg dark:bg-black/20 dark:shadow-none md:col-span-3 md:row-start-3">
            <p className="indent-4">{item.description}</p>
          </div>
          <div className="flex h-fit flex-col justify-center place-self-auto rounded-md bg-interactive p-4 shadow-lg dark:bg-black/20 dark:shadow-none sm:mx-20 md:col-start-3 md:row-start-1 md:mx-0">
            <div className="rounded-t-md bg-primary p-2 ring-2 ring-primary">
              <div className="text-interactive_text flex justify-between p-1 dark:text-text">
                <span>Price&nbsp;:</span>
                <PriceDisplay price={item.price} />
              </div>
              <div className="text-interactive_text flex justify-between p-1 dark:text-text">
                <span>Stock&nbsp;:</span>
                <DisplayStock
                  amount={item.amount}
                  amountSold={item.amountSold}
                />
              </div>
              <AddToCart
                price={item.price}
                type={"market"}
                item={item.item}
                id={item.id}
                amountLeft={item.amount}
              />
            </div>
            <div className="mb-7 flex flex-col rounded-md rounded-t-none p-2 text-sm shadow-lg ring-2 ring-primary dark:shadow-none md:text-base">
              {item.preorder &&
              item.releaseDate &&
              item.releaseDate > new Date(Date.now()) ? (
                <div
                  title="Tickets are being sold until this date"
                  className="flex justify-between p-1"
                >
                  <span>Coming :</span>
                  <span>{item.releaseDate?.toUTCString().slice(0, -7)}</span>
                </div>
              ) : (
                <></>
              )}
              <div
                title="Organizer's profile"
                className="flex justify-between p-1"
              >
                <span>Seller&nbsp;:&nbsp;</span>
                <span className="transition-all duration-300 hover:text-link hover:underline">
                  <Link href={`/users/${item.merchantName}`}>
                    {item.merchantName}
                  </Link>
                </span>
              </div>
            </div>
            <LikeAndDislike
              itemId={item.id}
              amountOfLikes={item._count.likes}
              amountOfDislikes={item._count.dislikes}
            />
          </div>
        </div>
        <Comments itemId={item.id} eventId={null} />
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screenReducedBy6Rem flex-col items-center justify-center gap-2 bg-interactive p-20 dark:bg-inherit">
        <Heading2 text={name} />
        <Heading3 text="Item not found" />
        <Button
          title="Go back to Market"
          text="go back to Market"
          link="/market"
        />
      </main>
    );
  }
};

export default page;
