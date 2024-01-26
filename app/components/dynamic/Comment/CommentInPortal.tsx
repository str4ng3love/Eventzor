'use client'

import { useEffect, useState } from "react"
import Portal from "../../Portal"
import CommentComponent from "./CommentComponent"
import SpinnerMini from "../../static/SpinnerMini"
import { CommentProps } from "@/types/interfaces"
interface Props {
    id: string | null
    cleanupFn: () => void
}
const CommentInPortal = ({ id, cleanupFn }: Props) => {
    const [comment, setComent] = useState<CommentProps | null>(null)
    const [working, setWorking] = useState(false)

    const getComment = async (id: string | null) => {
        if (id === null) {
            return
        }
        try {
            setWorking(true)
            const resp = await fetch('/api/comments/' + id, { cache: "no-store" })
            const comment = await resp.json()

            setWorking(false)
            return comment.comment
        } catch (error) {
            setWorking(false)
            console.log(error)
        }
    }
    useEffect(() => {
        (async () =>
            setComent(await getComment(id))
        )()

    }, [id])
    return (
        <>
            {comment !== null ?
                <Portal cleanUp={() => cleanupFn()} child={<CommentComponent triggerRefetchFN={async () =>
                    setComent(await getComment(id))}
                    {...comment} author={comment.authorName} text={comment.message} likes={comment._count.likes} dislikes={comment._count.dislikes}
                    amountOfReplies={comment._count.children} createdAt={new Date(comment.createdAt)} />} />
                :
                <></>}

            {working ?
                <Portal styled={false} child={<SpinnerMini borderSize="border-[12px]" h="h-16" w="w-16" />} />
                :
                <></>}</>
    )
}

export default CommentInPortal