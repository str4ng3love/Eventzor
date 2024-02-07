"use client"

import { useEffect, useState } from "react";

type Props = {
    amount: number;
    amountSold: number
}


const DisplayStock = ({ amount, amountSold }: Props) => {

    const percentage = (amount / (amount + amountSold) * 100).toFixed(0)
    let bg = "bg-link"
    if (parseInt(percentage) <= 70) bg = "bg-emerald-500"
    if (parseInt(percentage) <= 40) bg = "bg-yellow-500"
    if (parseInt(percentage) <= 20) bg = "bg-orange-500"
    if (parseInt(percentage) <= 10) bg = "bg-red-500"

    if (amount === 0) {
        return <span>Out of Stock</span>
    }

    return (
        <span className={`w-[100%] min-w-[5rem] flex justify-between items-center sm:mx-4  ring-1 ring-text px-1 rounded-sm`}>

            <span className={`block w-[${((amount / (amount + amountSold)) * 100).toFixed(0)}%] ${bg} h-4`} />


            <span className={`block w-[${((amountSold / (amount + amountSold)) * 100).toFixed(0)}%]  h-4`} />

        </span>
    )
}

export default DisplayStock