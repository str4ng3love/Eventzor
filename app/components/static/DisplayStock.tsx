"use client"

import { useEffect, useState } from "react";
import SpinnerMini from "./SpinnerMini";




type Props = {
    amount: number;
    amountSold: number
}

const DisplayStock = ({ amount, amountSold }: Props) => {
    const stock = `w-[${(((amount - amountSold) / amount) * 100).toFixed(0)}%]`
    const sold = `w-[${((amountSold / amount) * 100).toFixed(0)}%]`

    if (stock === undefined || sold == undefined) {
        return <div className="w-full flex justify-center items-center">
            <SpinnerMini borderSize="border-4" w="w-4" h="h-4" />
        </div>
    }
    if (amount - amountSold === 0) {
        return <span>Out of Stock</span>
    }

    return (

        <span className={`group w-[100%] min-w-[5rem] flex justify-between items-center sm:mx-4  ring-1 ring-text px-1 rounded-sm relative`}>
            <span className="bg-black/30 absolute w-full text-center text-sm group-hover:animate-fadeIn animate-fadeOut">{amount} / {amountSold}</span>
            <span className={`block ${stock} bg-link h-4`} />
            <span className={`block ${sold} h-4`} />
        </span>
    )
}

export default DisplayStock