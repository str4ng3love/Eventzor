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

      <div className="mt-[4rem]">
        <div className="p-2 gap-2 flex">
          <Button text="All" link="/orders" title="All orders"/>
          <Button text="Pending" link="/orders/pending" title="Pending orders"/>
          <Button text="active" link="/orders/active" title="active orders"/>
          <Button text="completed" link="/orders/completed" title="completed orders"/>

        </div>
      </div>


      {children}

    </main>
  );
}