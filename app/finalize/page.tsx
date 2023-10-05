import { OrderBrowser } from "../components/dynamic/Orders/OrderBrowser"


const page = () => {
  return (
    <div className="min-h-screen pt-20">
        <h1>Your Orders</h1>
        <OrderBrowser />
    </div>
  )
}

export default page