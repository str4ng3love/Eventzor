import Button from "@/app/components/dynamic/Button";
import { Heading2, Heading3 } from "@/app/components/static/Heading";

import ImageBrowser from "@/app/components/dynamic/ImageBrowser";
import Link from "next/link";
import AddToCart from "@/app/components/dynamic/ShoppingCart/AddToCart";
import PriceDisplay from "@/app/components/static/PriceDisplay";
import Comments from "@/app/components/dynamic/Events/Comments";
import getItem from "@/helpers/getIItem";
import LikeAndDislike from "@/app/components/dynamic/LikeAndDislike";

const page = async ({params}:{params:{slug:string}}) => {
const name = decodeURIComponent(params.slug)
  const  item  = await getItem(decodeURI(name));
console.log(item)
  if (item !== null) {
    return (
      <main className="flex flex-col items-center min-h-[calc(100dvh_-_4rem)] pt-20">
        <div className="grid grid-cols-3 justify-between lg:w-[80%] lg:gap-4 gap-2 w-full p-4 transition-all duration-300 ">
          <div className="p-4 flex flex-col rounded-md bg-bg_interactive dark:bg-black/20 col-span-2 row-span-2 ">
            <h2 className="p-4 font-bold text-2xl">{item.item}</h2>
            <div className="flex flex-col p-2 my-8">
             
            </div>
            <ImageBrowser images={item.images} />
          </div>
          <div className="bg-black/20 "><LikeAndDislike itemId={item.id} amountOfLikes={item._count.likes} amountOfDislikes={item._count.dislikes} /></div>
          <div className="p-4 flex flex-col justify-start rounded-md bg-bg_interactive dark:bg-black/20 row-start-3 col-span-3">
            <p className="indent-4">{item.description}</p>
          </div>
          <div className="p-4 flex flex-col justify-start rounded-md bg-bg_interactive dark:bg-black/20 h-fit row-start-1 col-start-3 self-start">
            <div className=" bg-primary ring-2 ring-primary rounded-t-md p-2">
              <div className="flex justify-between p-1 text-interactive_text dark:text-text">
               
              </div>
              <div className="flex justify-between p-1 text-interactive_text dark:text-text">
                <span>Price:&nbsp;</span>
                <PriceDisplay price={item.price}/>
              </div>
              <AddToCart price={item.price} type={'market'} item={item.item}  id={item.id}
                />
            </div>
            <div className="flex flex-col ring-2 rounded-t-none ring-primary rounded-md p-2 lg:text-sm md:text-base">
              <div  title="Tickets are being sold until this date" className="flex justify-between p-1">
              <span>Coming :</span>
              <span>{item.releaseDate?.toUTCString().slice(0, -7)}</span>
              </div>
          
              <div title="Organizer's profile" className="flex justify-between p-1">
                <span>Seller&nbsp;:&nbsp;</span>
                <span className="hover:text-link transition-all duration-300">
                  <Link href={"#"}>{item.merchantName}</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
        <Comments eventId={item.id}/>
      </main>
    );
  } else {
    return (
      <main className="flex flex-col justify-center gap-2 items-center min-h-[calc(100dvh_-_4rem)]">

        <Heading2 text={name} />
        <Heading3 text="Item not found" />
        <Button title="Go back to Market" text="go back to Market" link="/market" />
      </main>
    );
  }
};

export default page;
