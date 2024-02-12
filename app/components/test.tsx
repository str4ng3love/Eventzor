'use client'


const Test = async () => {


    const createOrder = async () => {

        try {
            const resp = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order: { items: [{ amount: 5, item: 'stefcas', price: 123, type: "event",id: `65abd16f265592d398960181` }], currency: { name: 'pln', rate: 1 }, shippingData: { address: "", method: "email" } },
                }),
            });
            const message = await resp.json();
            console.log(message)

        } catch (error) {

            console.log(error);
        }
    };
    return (
        <>

            <h1>test</h1>
            <button className="p-5 absolute top-0 translate-y-48 hover:cursor-pointer hover:bg-link" onClick={() => createOrder()}>test</button>
        </>
    )
}


export default Test