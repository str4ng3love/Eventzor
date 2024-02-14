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
    let order = 'asc'
    let badRequestPage = false
    let badRequestRange = false
    let badRequestOrder = false
    if (typeof searchParams.order === "string") {
        if (searchParams.order !== "asc" && searchParams.order !== "desc") {
            badRequestOrder = true


        } else {
            order = searchParams.order
        }
    } else {

        badRequestOrder = true

    }
    if (typeof searchParams.page === "string" && !isNaN(parseInt(searchParams.page))) {
        if (parseInt(searchParams.page) === 0 || parseInt(searchParams.page) < 0) {
            badRequestPage = true
        } else {
            page = parseInt(searchParams.page) - 1
        }
    } else {

        badRequestPage = true
    }
    if (typeof searchParams.range === "string" && !isNaN(parseInt(searchParams.range))) {
        if (parseInt(searchParams.range) === 0 || parseInt(searchParams.range) < 0) {
            badRequestRange = true
        } else {
            range = parseInt(searchParams.range)
        }
    } else {
        badRequestRange = true

    }

    if (badRequestPage || badRequestRange || badRequestOrder) {

        return (<div className="mt-12 flex flex-col items-center justify-center">
            <h1 className="font-bold text-xl mb-6">Error Occured:</h1>
            <span className="flex gap-2 flex-col p-8">
                {badRequestPage ? <span>-&nbsp;Received incorrect amount of requested pages:&nbsp; {searchParams.page ? searchParams.page : "nothing"}<br />&nbsp; Expected: positive number</span> : null}
                {badRequestRange ? <span>-&nbsp;Received incorrect range of requested items:&nbsp; {searchParams.range ? searchParams.range : "nothing"}<br />&nbsp; Expected: positive number</span> : null}
                {badRequestOrder ? <span>-&nbsp;Received incorrect order of requested items:&nbsp; {searchParams.order ? searchParams.order : "nothing"}<br />&nbsp; Expected:&apos;asc&apos; or &apos;desc&apos;.</span> : null}
            </span>
            <div className="flex flex-row gap-2">
                <Button title="go to home" text="go to Home" link="/" />
                <Button title="Events" text="go to Events" link="/events" />
            </div>
        </div>)
    } else {


        const now = Date.now()
        const dateNow = new Date(now)
        switch (category) {
            case "popular":
                const queryPopular: Prisma.EventFindManyArgs = {
                    where: { images: { isEmpty: false } }, skip: range * page, take: range, orderBy: { ticketsSold: order === "desc" ? order : "asc" }
                }
                queryOptions = queryPopular
                break;
            case "most-liked":
                const queryLiked: Prisma.EventFindManyArgs = {
                    where: { images: { isEmpty: false } }, skip: range * page, take: range, orderBy: {
                        likes: {
                            _count: order === "desc" ? order : "asc"
                        },

                    },
                }
                queryOptions = queryLiked
                break;
            case "upcoming":
                const queryUpcoming: Prisma.EventFindManyArgs = {
                    where: { AND:[{images: { isEmpty: false }}, {eventDate: {gte: dateNow}}] }, skip: range * page, take: range, orderBy: { eventDate: order === "desc" ? order : "asc" }
                }
                queryOptions = queryUpcoming
                break;
            case "sales-ending":
                const querySalesEnding: Prisma.EventFindManyArgs = {
                    where: { AND: [{ images: { isEmpty: false } }, { closingDate: { gte: dateNow }}] }, skip: range * page, take: range, orderBy: { closingDate: order === "desc" ? order : "asc" },
                }
                queryOptions = querySalesEnding
                break;
            case "all-items":

                const queryAll: Prisma.EventFindManyArgs = {
                    where: { images: { isEmpty: false } }, skip: range * page, take: range, orderBy: { title: order === "desc" ? order : "asc" }
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
                    <EventsBrowser events={events} count={count} currentPage={page + 1} currentRange={range} selectedCategory={category.replace("-", " ")} orderAsc={order === "asc" ? true : false} />

                </>
            );
        }
    }
};

export default page;
