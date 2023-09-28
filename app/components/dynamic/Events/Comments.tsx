
import AddComment from "../Comment/AddComment";
import { prisma } from "@/lib/ConnectPrisma";
import CommentComponent from "../Comment/CommentComponent";


interface Props {
  eventId: string;
}
const getComments = async (id: string) => {

    try {
      const comments = prisma.comment.findMany({
        where: { eventId: id },
        orderBy: { createdAt: "desc" },
       include:{_count:{select:{children:true, likes:true, dislikes:true}}}
      });

      return { comments };
    } catch (error) {
      console.log(error);
    }
  

};
const Comments = async ({ eventId }: Props) => {
  const comments = await getComments(eventId);

  return (
    <div className="flex my-8 w-[85%] justify-between">
      <div className="p-2  bg-black/20 w-full">
        <AddComment title="Add a comment" eventId={eventId} />

        {comments ? (
          (await comments.comments).map((c) => (
            <CommentComponent
              likes={c._count.likes}
              dislikes={c._count.dislikes}
              status={c.status}
              key={c.id}
              id={c.id}
              author={c.authorName}
              text={c.message}
              createdAt={c.createdAt}
              updatedAt={c.updatedAt ? c.updatedAt : null}
              amountOfReplies={c._count.children}
            />
          ))
        ) : (
          <></>
        )}

      </div>

      <div className="p-4 mx-2 bg-black/20 min-w-[15%] h-fit">
        other events and stuff
      </div>
    </div>
  );
};

export default Comments;
