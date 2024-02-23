import Image from "next/image";
import Link from "next/link";
import SpinnerMini from "../../static/SpinnerMini";

interface Props {
  item: {
    item: string;
    price: number;
    amount: number;
    amountSold: number;
    images: string[];
  };
  currency: { name: string; rate: number };
}

const ItemCarouselItem = ({ item, currency }: Props) => {
  return (
    <div className="flex h-[20rem] bg-black ring-2 ring-primary transition-all duration-150">
      <Link
        href={"/item/" + encodeURIComponent(item.item)}
        title={item.item}
        className={`group relative flex h-[20rem] w-full overflow-hidden`}
      >
        <span className="absolute z-50 flex h-full w-full items-center justify-center bg-black/40 text-xl font-bold opacity-0 transition-all duration-300 group-hover:opacity-100 lg:hidden">
          {item.item}
        </span>

        <Image
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 720px) 50vw"
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
          alt="event's image"
          src={item.images[0]}
        />
      </Link>
      <div
        className={`hidden  w-[50%] flex-col justify-between bg-gradient-to-br from-primary to-slate-300 p-1 dark:to-slate-900 lg:flex`}
      >
        <h2 className="grow-[1] p-2 text-xl font-bold first-letter:uppercase">
          {item.item}
        </h2>

        <div className="flex flex-col justify-between text-sm">
          <span className="p-1">
            In stock:&nbsp;
            {item.amount - item.amountSold}
          </span>
          <span className="flex items-center justify-center p-1"></span>
          <span className="flex items-center justify-center p-1 text-lg">
            {currency.name === "initial" ? (
              <SpinnerMini h="h-4" w="w-4" borderSize="border-[3px]" />
            ) : (
              (item.price * currency.rate).toFixed(2)
            )}
            &nbsp;
            {currency.name === "initial"
              ? ""
              : currency.name.toLocaleUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItemCarouselItem;
