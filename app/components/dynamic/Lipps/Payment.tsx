'use client'


interface Props {
    id: string
    orders: ParsedOrder
}

import { useEffect, useState } from "react";
import Button from "../Button"
import { ParsedOrder } from "@/types/interfaces";
import SpinnerMini from "../../static/SpinnerMini";
import Notification from "../../static/Notification";
import { useRouter } from "next/navigation";


const Payment = ({ id, orders }: Props) => {
    const [selectedCurrency, setSelectedCurrency] = useState<{ name: string, rate: number }>()
    const [total, setTotal] = useState<number>()
    const [processing, setProcessing] = useState(false)
    const [notify, setNotify] = useState({ show: false, error: false, message: '' })
    const router = useRouter()

    const approvePayment = async () => {
        setProcessing(true)
        try {
            const resp = await fetch(`/api/orders/imagine`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: id }) })
            const data:{error?:string, message?:string} = await resp.json()
            if (data.error) {
                let err
                data.error.includes("Record to update not found.") ? err="Order already processed. You will now be redirected to the Orders page." : err=data.error
                setNotify({ error: true, show: true, message: err })
                setProcessing(false)
            } else if(data.message) {
                setNotify({ error: false, show: true, message: data.message })
                setProcessing(false)
            }
        } catch (error) {
            setNotify({ error: true, show: true, message: "Cannot connect to the service, try again later." })
            setProcessing(false)
            console.log(error)
        }
    }
    useEffect(() => {
        const currency = localStorage.getItem("currency");
        if (currency) {
            let selectedCurrency = JSON.parse(currency);
            setSelectedCurrency({
                name: selectedCurrency.name,
                rate: selectedCurrency.rate,
            });
        }
    }, [])
    useEffect(() => {
        window.addEventListener("currency", () => {
            const currency = localStorage.getItem("currency");
            if (currency) {
                let selectedCurrency = JSON.parse(currency);
                setSelectedCurrency({
                    name: selectedCurrency.name,
                    rate: selectedCurrency.rate,
                });
            }
        });

        return () => {
            window.removeEventListener("currency", () => { });
        };
    });
    useEffect(() => {
        if (selectedCurrency?.rate) {
            const total = orders?.amounts.reduce((acc, val) => {
                acc = acc + val.price * selectedCurrency?.rate * val.amount;
                return parseFloat(acc.toFixed(2));
            }, 0)
            setTotal(total)
        }
    }, [selectedCurrency])

    return (<>
        <div className="flex flex-col ">
            <div className="my-4 flex justify-center items-center">

                <span>Total value of the order&nbsp;:&nbsp;</span>
                {typeof total === "undefined" && typeof selectedCurrency?.name === "undefined" ? <span className="pl-4"><SpinnerMini borderSize="border-4" h="h-6" w="w-6" /></span> : <span className="pl-4 font-semibold text-xl">{total}&nbsp;{selectedCurrency?.name.toLocaleUpperCase()}</span>}

            </div>
            {processing ?
                <div className="flex flex-col justify-center items-center">
                    <span className="p-4 font-semibold">
                        Thank you for using L.I.P.P.S. service!
                    </span>
                    <span className="p-4 font-semibold animate-pulse text-xl">
                        Processing your payment.
                    </span>
                </div> : <span className="mx-auto"><Button text="Imagine Paying!" title="Imagine Paying!" fn={() => { approvePayment() }} /></span>}

        </div>
        <Notification show={notify.show} error={notify.error} message={notify.message} onAnimEnd={() => {setNotify({ error: false, show: false, message: "" }); 
        router.replace("/orders")}} />
    </>
    )
}
export default Payment