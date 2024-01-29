import { Metadata } from "next";
import { getNewestItems } from "@/helpers/getIItem";
import ItemCarousel from "../components/dynamic/Market/ItemCarousel";


export const metadata: Metadata = {
    title: "Dashboard Demo | Market",
    description: "Dashboard Demo",
};
export default async function layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const {items} = await getNewestItems()

    return (
        <main className="flex flex-col items-center min-h-screen ">

        <div className="relative bg-item-hero w-full bg-cover bg-center bg-no-repeat transition-all lg:before:hidden before:absolute before:top-0 before:bg-gradient-radial before:to-transparent before:via-transparent before:h-full before:w-full  before:from-slate-900">
          <ItemCarousel
            heading="Newest Items"
            items={items}
            darkBgAlpha={false}
            fullWidthBlur={true}
          />
        </div>

       
        {children}
       
      </main>
    );
}