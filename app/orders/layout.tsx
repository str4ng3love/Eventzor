import { Metadata } from "next";
import Button from "../components/dynamic/Button";



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
    <main className="flex flex-col items-center min-h-screen">

      <div className="mt-[6rem]">
        <div className="p-2 gap-2 flex">
          <Button text="All" link="/orders" title="All orders"/>
          <Button text="Pending" link="/orders/pending" title="Pending orders"/>
          <Button text="In Shipping" link="/orders/shipping" title="orders in shipping"/>
          <Button text="completed" link="/orders/completed" title="completed orders"/>
          <Button text="canceled" link="/orders/canceled" title="canceled orders"/>

        </div>
      </div>


      {children}

    </main>
  );
}