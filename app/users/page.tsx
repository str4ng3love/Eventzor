import { prisma } from "@/lib/ConnectPrisma"
import Link from "next/link"



const page = async () => {

    const users = await prisma.user.findMany({ select: { name: true } })

    return (
        <>
            <div className="w-[80%] mt-20">
                <div className="bg-bg_interactive p-8 ring-2 ring-primary rounded-md grid gap-2 xl:grid-cols-8 lg:grid-cols-6 grid-cols-4">
                    {users ? users.map((u,i) => <Link key={i} href={`/users/${u.name}`}><div className={`hover:bg-link flex items-center justify-center rounded-md p-4`}>{u.name}</div></Link>) : <></>}
                </div>
            </div>
        </>
    )
}

export default page