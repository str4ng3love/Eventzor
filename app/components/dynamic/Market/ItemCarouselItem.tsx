
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
    }
    currency: { name: string, rate: number }
}

const ItemCarouselItem = ({ item, currency }: Props) => {

    return (

        <div className="flex ring-2 ring-primary bg-black h-[20rem] transition-all duration-150">
            <Link
                href={"/item/" + encodeURIComponent(item.item)}
                title={item.item}
                className={`flex relative group overflow-hidden w-full h-[20rem]`}
            >
                <span className="opacity-0 absolute z-50 h-full w-full bg-black/40 flex lg:hidden group-hover:opacity-100 justify-center items-center text-xl font-bold transition-all duration-300">
                    {item.item}
                </span>

                <Image
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 720px) 50vw"
                  style={{ objectFit: "cover", }}
                  placeholder="blur"
                  blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
                  alt="event's image"
                  src={item.images[0]}
                />
            </Link>
            <div className={`hidden  bg-gradient-to-br from-primary dark:to-slate-900 to-slate-300 lg:flex flex-col justify-between p-1 w-[50%]`}>
                <h2 className="p-2 first-letter:uppercase font-bold text-xl grow-[1]">
                    {item.item}
                </h2>


                <div className="text-sm flex flex-col justify-between">
                

                    <span className="p-1">
                        In stock:&nbsp;
                        {item.amount - item.amountSold}
                    </span>
                    <span className="p-1 flex items-center justify-center">
                    </span>
                    <span className="p-1 flex items-center justify-center text-lg">
                        {currency.name === "initial" ? (
                            <SpinnerMini
                                h="h-4"
                                w="w-4"
                                borderSize="border-[3px]"
                            />
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

    )
}

export default ItemCarouselItem