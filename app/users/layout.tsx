import { Metadata } from "next";
import Footer from "../components/static/Footer";



export const metadata: Metadata = {
    title: "Dashboard Demo | Users",
    description: "Dashboard Demo",
};
export default async function layout({
    children,
}: {
    children: React.ReactNode;
}) {


    return (<>
        <main className="flex flex-col items-center min-h-screenReducedBy6Rem">

            {children}

        </main>
        <Footer />

    </>
    );
}