import { prisma } from "@/lib/ConnectPrisma"
import Link from "next/link"
import { Heading1 } from "../components/static/Heading"



const page = async () => {

    const users = await prisma.user.findMany({ select: { name: true, }, orderBy: { name: "asc" }, })

    return (
        <>
            <div className="w-[80%] mt-20">
                <Heading1 text="users" />
                <div className="bg-bg_interactive p-8 ring-2 ring-primary rounded-md grid gap-2 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 mb-10">
                    {users ? users.sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase())).map((u, i) => <Link key={i} href={`/users/${u.name}`}><div className={`hover:bg-link flex items-center justify-center rounded-md p-4`}>{u.name}</div></Link>) : <></>}
                </div>
            </div>
        </>
    )
}

export default page