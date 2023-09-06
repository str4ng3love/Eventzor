
import { getServerSession } from "next-auth"
import AddComment from "../Comment/AddComment"
import Comment from "../Comment/Comment"
import { options } from "@/app/api/auth/[...nextauth]/options"
import { prisma } from "@/lib/ConnectPrisma";

interface Props {
    eventId: string;
}
const getComments = async (id:string)=>{
    try {
        const comments = prisma.comment.findMany({where:{eventId: id}, orderBy: {createdAt: 'desc'}})
        return {comments}
    } catch (error) {
        console.log(error)
    }
}
const Comments = async ({eventId}:Props) => {
    const comments = await getComments(eventId)
    const session = await getServerSession(options)
  return (
    <div className="flex my-8 w-[85%] justify-between">
        <div className="p-2  bg-black/20 w-full">
          
        {session?.user?.name ?      <AddComment eventId={eventId} author={session.user.name}/> :<></>}
        {comments ? (await comments.comments).map((c)=>(<Comment author={c.authorName} text={c.message} createdAt={c.createdAt} updatedAt={c.updatedAt? c.updatedAt:null}/>)): <>no comments found</>}

    
        </div>
       
        <div className="p-4 mx-2 bg-black/20 min-w-[15%] h-fit">other events and stuff</div>


    </div>
  )
}

export default Comments