import { MyOrderBrowser,  } from "../components/dynamic/Orders/MyOrderBrowser"


const page = () => {
  return (
    <div className="min-h-screen pt-20">
        <h1>Your Orders</h1>
        <MyOrderBrowser  />
    </div>
  )
}

export default page