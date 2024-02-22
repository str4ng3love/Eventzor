'use client'

import { Fragment, useEffect, useState } from "react"

interface Props {
    data: { text: string, target: string | number }[]
    interval?: number
}

const Informer = ({ data, interval = 1000 }: Props) => {
    const [current, setCurrent] = useState(0)
    const [out, setOut] = useState(false)

    useEffect(() => {
        const id = setInterval(() => {
            setOut(false)
            setTimeout(() => {
                setOut(true)
            }, interval - 1000);
            setCurrent(prev => prev += 1)

        }, interval)
        return () => clearInterval(id)
    }, [])
    useEffect(() => {

        if (current === data.length) {
            setCurrent(0)
        }
    }, [current])
    return (
        <div className="p-1">
            {data.map((d, i) => <Fragment key={i}>
                {current === i ?
                    <div className={`animate-fadeIn ${out ? 'animate-fadeOut' : ""} md:text-2xl text-xl`}>
                        <span className="font-semibold text-teal-600 dark:text-teal-300">{d.target}&nbsp;</span>
                        <span>{d.text}</span>
                    </div> : null}</Fragment>)


            }

        </div>


    )
}


export default Informer