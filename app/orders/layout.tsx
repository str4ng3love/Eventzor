import { Metadata } from "next";
import Button from "../components/dynamic/Button";
import Footer from "../components/static/Footer";



export const metadata: Metadata = {
  title: "Dashboard Demo | Orders",
  description: "Dashboard Demo",
};
export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <>
    <main className="flex flex-col items-center min-h-[calc(100dvh_-_6rem)]">

      <div className="mt-[6rem]">
        <div className="p-2 gap-2 grid sm:grid-cols-5 grid-cols-2">
          <Button text="All" link="/orders" title="All orders" size="text-sm"/>
          <Button text="Pending" link="/orders/pending" title="Pending orders" size="text-sm"/>
          <Button text="In Shipping" link="/orders/shipping" title="orders in shipping" size="text-sm"/>
          <Button text="completed" link="/orders/completed" title="completed orders" size="text-sm"/>
          <Button text="canceled" link="/orders/canceled" title="canceled orders" size="text-sm sm:col-span-1 col-span-2" bgColor="bg-secondary"/>

        </div>
      </div>


      {children}

    </main>
    <Footer />
    </>
  );
}