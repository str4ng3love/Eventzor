import { Metadata } from "next";
import Footer from "../components/static/Footer";



export const metadata: Metadata = {
    title: "Dashboard Demo | PayGuy",
    description: "Dashboard Demo",
};
export default async function layout({
    children,
}: {
    children: React.ReactNode;
}) {


    return (<>
        <main className={`flex flex-col items-center min-h-[calc(100dvh_-_9rem)] w-full bg-gray-600 
       `}>
            <h1 className={`relative z-10 mt-32 text-xl p-4 mb-16 before:absolute before:top-[100%] before:right-[50%] before:translate-x-[50%] before:-translate-y-2 
        before:bg-lips before:bg-center before:bg-cover before:h-20 before:w-20 before:content-["L.I.P.P.S."] before:flex before:items-end 
        before:justify-center before:text-base before:-rotate-45`}>Welcome to Let&apos;s Imagine Paying Payment System</h1>
            <div className="z-10  ">
                {children}
            </div>




        </main>
        <Footer />
        </>
    );
}