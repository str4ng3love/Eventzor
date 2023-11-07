import { Suspense } from "react"
import { MyOrderBrowser, } from "../components/dynamic/Orders/MyOrderBrowser"
import SpinnerMini from "../components/static/SpinnerMini"



const page = () => {
  return (
    <div className="min-h-screen pt-20 w-full flex justify-center">
      <div className="w-[80%] p-8">
        <Suspense fallback={<SpinnerMini borderSize="border-[1rem]" h="h-12" w="w-12" />}>
          <MyOrderBrowser />
        </Suspense>
      </div>
    </div>
  )
}

export default page