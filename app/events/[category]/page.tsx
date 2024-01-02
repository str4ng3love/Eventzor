import Button from "@/app/components/dynamic/Button";
import EventsBrowser from "@/app/components/dynamic/Events/EventsBrowser";
import { prisma } from "@/lib/ConnectPrisma";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";


const page = async ({ params, searchParams }: { params: { category: string }, searchParams: { [key: string]: string | string[] | undefined } }) => {

    const getEventsAndAmount = async (query: Prisma.EventFindManyArgs | null) => {
        console.log(`Skipping: ${range * page} positions, taking: ${range} documents`)
       
        if (query === null) {
            return notFound()
        }
        const [events, count] = await prisma.$transaction([
            prisma.event.findMany(query), prisma.event.count({ where: query.where })
        ])
        return {
            events, count
        }

    }
    const category = decodeURIComponent(params.category)
    let queryOptions

    

    const page = typeof searchParams.page === "string" ? parseInt(searchParams.page)-1 : 0
    const range = typeof searchParams.range === "string" ? parseInt(searchParams.range) : 10


    switch (category) {
        case "popular":
            const queryPopular: Prisma.EventFindManyArgs = {
                where: { images: { isEmpty: false } }, skip: range*page ,take: range
            }
            queryOptions = queryPopular
            break;
        case "most-liked":
            const queryLiked: Prisma.EventFindManyArgs = {
                where: { images: { isEmpty: false } }, skip: range*page ,take: range, orderBy: {
                    likes: {
                        _count: "desc"
                    }
                },
            }
            queryOptions = queryLiked
            break;
        case "upcoming":
            const queryUpcoming: Prisma.EventFindManyArgs = {
                where: { images: { isEmpty: false } }, skip: range*page ,take: range, orderBy: { ticketsSold: "desc" }
            }
            queryOptions = queryUpcoming
            break;
        case "sales-ending":
            const querySalesEnding: Prisma.EventFindManyArgs = {
                where: { images: { isEmpty: false } }, skip: range*page ,take: range, orderBy: { closingDate: 'asc' },
            }
            queryOptions = querySalesEnding
            break;
        case "all-items":

            const queryAll: Prisma.EventFindManyArgs = {
                where: { images: { isEmpty: false } }, skip: range*page ,take: range, orderBy: { title: "asc" }
            }
            queryOptions = queryAll
            break;
        default:

            queryOptions = null
            break;
    }

    const { events, count } = await getEventsAndAmount(queryOptions)
    if (events.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="font-bold text-xl mb-12">There are no Events in the DB</h1>
                <Button title="go to home" text="go to Home" link="/" />
            </div>
        );
    } else {
        return (
            <>

                {/* TODO: Event browser with sorting, pagination etc */}
                <EventsBrowser events={events} count={count} selectedCategory={category.replace("-", " ")} />
                
            </>
        );
    }
};

export default page;
