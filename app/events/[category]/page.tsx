import Button from "@/app/components/dynamic/Button";
import EventsBrowser from "@/app/components/dynamic/Events/EventsBrowser";
import { prisma } from "@/lib/ConnectPrisma";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";


const page = async ({ params, searchParams }: { params: { category: string }, searchParams: { [key: string]: string | string[] | undefined } }) => {

    const getEventsAndAmount = async (query: Prisma.EventFindManyArgs | null) => {


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

    let page = 0
    let range = 10
    let badRequestPage = false
    let badRequestRange = false
    let order = searchParams.order
    if (typeof searchParams.page === "string" && !isNaN(parseInt(searchParams.page))) {
        page = Math.abs(parseInt(searchParams.page)) - 1
    } else {
        badRequestPage = true
    }
    if (typeof searchParams.range === "string" && !isNaN(parseInt(searchParams.range))) {
        range = Math.abs(parseInt(searchParams.range)) - 1
    } else {
        badRequestRange = true
    }
    if (badRequestPage || badRequestRange) {

        return (<div className="mt-12 flex flex-col items-center justify-center">
            <h1 className="font-bold text-xl mb-6">Error Occured:</h1>
            <span className="flex gap-2 flex-col p-8">
                {badRequestPage ? <span>-&nbsp;incorrect  amount of requested pages</span> : null}
                {badRequestRange ? <span>-&nbsp;incorrect range of requested items</span> : null}
            </span>
            <div className="flex flex-row gap-2">
                <Button title="go to home" text="go to Home" link="/" />
                <Button title="Events" text="go to Events" link="/events" />
            </div>
        </div>)
    } else {




        switch (category) {
            case "popular":
                const queryPopular: Prisma.EventFindManyArgs = {
                    where: { images: { isEmpty: false } }, skip: range * page, take: range, orderBy: { ticketsSold: order === "asc" ? order : "desc" }
                }
                queryOptions = queryPopular
                break;
            case "most-liked":
                const queryLiked: Prisma.EventFindManyArgs = {
                    where: { images: { isEmpty: false } }, skip: range * page, take: range, orderBy: {
                        likes: {
                            _count: order === "asc" ? order : "desc"
                        }
                    },
                }
                queryOptions = queryLiked
                break;
            case "upcoming":
                const queryUpcoming: Prisma.EventFindManyArgs = {
                    where: { images: { isEmpty: false } }, skip: range * page, take: range, orderBy: { ticketsSold: order === "asc" ? order : "desc" }
                }
                queryOptions = queryUpcoming
                break;
            case "sales-ending":
                const querySalesEnding: Prisma.EventFindManyArgs = {
                    where: { images: { isEmpty: false } }, skip: range * page, take: range, orderBy: { closingDate: order === "asc" ? order : "desc" },
                }
                queryOptions = querySalesEnding
                break;
            case "all-items":

                const queryAll: Prisma.EventFindManyArgs = {
                    where: { images: { isEmpty: false } }, skip: range * page, take: range, orderBy: { title: order === "asc" ? order : "desc" }
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
                <div className="mt-12 flex flex-col items-center justify-center">
                    <h1 className="font-bold text-xl mb-12">There are no Events in the DB</h1>
                    <Button title="go to home" text="go to Home" link="/" />
                </div>
            );
        } else {
            return (
                <>

                    {/* TODO: Event browser with sorting, pagination etc */}
                    <EventsBrowser events={events} count={count} selectedCategory={category.replace("-", " ")} orderAsc={order === "asc" ? true : false}/>

                </>
            );
        }
    }
};

export default page;
