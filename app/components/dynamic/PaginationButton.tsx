"use client"

interface Props {
    fetchPage: ()=> void;
    count: number;
    limit: number;
}

const PaginationButton = ({count, limit }: Props) => {
    const reminder = count % limit
    const buttons = Array.from({ length: count / limit + (reminder ? 1 : 0) })
    return (<>
        {buttons.map((b, i) => 
        <div key={i} className="rounded-md mx-2 h-8 w-fit p-1 px-2 hover:bg-link transition-all duration-200 cursor-pointer active:bg-primary active:scale-110">
            {i+1}
        </div>)}
    </>
    )
}

export default PaginationButton