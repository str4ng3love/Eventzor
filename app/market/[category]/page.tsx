import Button from "@/app/components/dynamic/Button";
import { prisma } from "@/lib/ConnectPrisma";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import ItemsBrowser from "../../components/dynamic/Market/ItemBrowser";


const page = async ({ params, searchParams }: { params: { category: string }, searchParams: { [key: string]: string | string[] | undefined } }) => {

    const getItemsAndAmount = async (query: Prisma.MarketItemFindManyArgs | null) => {


        if (query === null) {
            return notFound()
        }
        const [items, count] = await prisma.$transaction([
            prisma.marketItem.findMany(query), prisma.marketItem.count({ where: query.where })
        ])
        return {
            items, count
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
                {badRequestPage ? <span>-&nbsp;Received incorrect amount of requested pages:&nbsp; {searchParams.page? searchParams.page: "nothing"}<br />&nbsp; Expected: positive number</span> : null}
                {badRequestRange ? <span>-&nbsp;Received incorrect range of requested items:&nbsp; {searchParams.range? searchParams.range: "nothing"}<br />&nbsp; Expected: positive number</span> : null}
                {badRequestOrder ? <span>-&nbsp;Received incorrect order of requested items:&nbsp; {searchParams.order? searchParams.order : "nothing"}<br />&nbsp; Expected:'asc' or 'desc'.</span> : null}
            </span>
            <div className="flex flex-row gap-2">
                <Button title="go to home" text="go to Home" link="/" />
                <Button title="Events" text="go to Events" link="/events" />
            </div>
        </div>)
    } else {



        switch (category) {
            case "popular":
                const queryPopular: Prisma.MarketItemFindManyArgs = {
                    where: { images: { isEmpty: false } }, skip: range * page, take: range, orderBy: { amountSold: order === "asc" ? order : "desc" }
                }
                queryOptions = queryPopular
                break;
            case "most-liked":
                const queryLiked: Prisma.MarketItemFindManyArgs = {
                    where: { images: { isEmpty: false } }, skip: range * page, take: range, orderBy: {
                        likes: {
                            _count: order === "asc" ? order : "desc"
                        }
                    },
                }
                queryOptions = queryLiked
                break;
            case "upcoming":
                const queryUpcoming: Prisma.MarketItemFindManyArgs = {
                    where: { images: { isEmpty: false } }, skip: range * page, take: range, orderBy: { releaseDate: order === "asc" ? order : "desc" }
                }
                queryOptions = queryUpcoming
                break;
            case "sales-ending":
                const querySalesEnding: Prisma.MarketItemFindManyArgs = {
                    where: { images: { isEmpty: false } }, skip: range * page, take: range, orderBy: {  },
                }
                queryOptions = querySalesEnding
                break;
            case "all-items":

                const queryAll: Prisma.MarketItemFindManyArgs = {
                    where: { images: { isEmpty: false } }, skip: range * page, take: range, orderBy: { item: order === "asc" ? order : "desc" }
                }
                queryOptions = queryAll
                break;
            default:

                queryOptions = null
                break;
        }

        const { items, count } = await getItemsAndAmount(queryOptions)
        if (items.length === 0) {
            return (
                <div className="mt-12 flex flex-col items-center justify-center">
                    <h1 className="font-bold text-xl mb-12">There are no Items in the DB</h1>
                    <Button title="go to home" text="go to Home" link="/" />
                </div>
            );
        } else {
              
            return (
                <>

                    {/* TODO: Event browser with sorting, pagination etc */}
                    <ItemsBrowser items={items} count={count} currentPage={page + 1} currentRange={range} selectedCategory={category.replace("-", " ")} orderAsc={order === "asc" ? true : false} />

                </>
            );
        }
    }
};

export default page;
