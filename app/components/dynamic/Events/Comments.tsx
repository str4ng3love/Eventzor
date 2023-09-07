import { getServerSession } from "next-auth";
import AddComment from "../Comment/AddComment";
import { options } from "@/app/api/auth/[...nextauth]/options";
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
      include: { children: { include: { _count: true } } },
    });
    return { comments };
  } catch (error) {
    console.log(error);
  }
};
const Comments = async ({ eventId }: Props) => {
  const comments = await getComments(eventId);
  const session = await getServerSession(options);
  return (
    <div className="flex my-8 w-[85%] justify-between">
      <div className="p-2  bg-black/20 w-full">
        {session?.user?.name ? (
          <AddComment
            title="Add a comment"
            eventId={eventId}
            author={session.user.name}
          />
        ) : (
          <>
            <span>login to comment</span>
          </>
        )}
        {comments ? (
          (await comments.comments).map((c) => (
            <CommentComponent
              id={c.id}
              author={c.authorName}
              text={c.message}
              createdAt={c.createdAt}
              updatedAt={c.updatedAt ? c.updatedAt : null}
              amountOfReplies={c.children.length}
            />
          ))
        ) : (
          <>no comments found</>
        )}
      </div>

      <div className="p-4 mx-2 bg-black/20 min-w-[15%] h-fit">
        other events and stuff
      </div>
    </div>
  );
};

export default Comments;
