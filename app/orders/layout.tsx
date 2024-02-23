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
      <main className="flex min-h-screenReducedBy6Rem flex-col items-center">
        <div className="mt-[6rem]">
          <div className="grid grid-cols-2 gap-2 bg-black/20 p-2 sm:grid-cols-5">
            <Button
              text="All"
              link="/orders"
              title="All orders"
              size="text-sm"
            />
            <Button
              text="Pending"
              link="/orders/pending"
              title="Pending orders"
              size="text-sm"
            />
            <Button
              text="In Shipping"
              link="/orders/shipping"
              title="orders in shipping"
              size="text-sm"
            />
            <Button
              text="completed"
              link="/orders/completed"
              title="completed orders"
              size="text-sm"
            />
            <Button
              text="canceled"
              link="/orders/canceled"
              title="canceled orders"
              size="text-sm sm:col-span-1 col-span-2"
              bgColor="bg-secondary"
            />
          </div>
        </div>

        {children}
      </main>
      <Footer />
    </>
  );
}
