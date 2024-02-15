'use client'

import AddNewEvent from "./Events/AddNewEvent"
import AddNewItem from "./Market/AddNewItem"

const CreateNew = () => {


    return(
        <>
         <AddNewEvent optimisticFn={() => { }} optimisticFnClnUp={() => { }} refetchTrigger={() => { }} />
        <AddNewItem optimisticFn={() => { }} optimisticFnClnUp={() => { }} refetchTrigger={() => { }} />
        </>
    )
}

export default CreateNew