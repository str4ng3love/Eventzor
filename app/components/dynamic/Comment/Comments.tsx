
import AddComment from "./AddComment";
import { prisma } from "@/lib/ConnectPrisma";
import CommentComponent from "./CommentComponent";
import { unstable_noStore as noStore } from 'next/cache';
import { CommentType } from "@/types/enums";

interface Props {
  eventId: string | null;
  itemId: string | null;
}

const getEventComments = async (id: string) => {
  noStore()
  try {

    const comments = await prisma.comment.findMany({
      where: { eventId: id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { children: true, likes: true, dislikes: true } } }
    });

    return { comments };
  } catch (error) {
    console.log(error);
  }


};
const getItemComments = async (id: string) => {
  noStore()
  try {

    const comments = await prisma.comment.findMany({
      where: { marketItemId: id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { children: true, likes: true, dislikes: true } } }
    });

    return { comments };
  } catch (error) {
    console.log(error);
  }


};
const Comments = async ({ eventId, itemId }: Props) => {
 
  let comments
  if (eventId !== null&& eventId !== undefined) {
    comments = await getEventComments(eventId);
  } else if (itemId && itemId !== undefined) {
    comments = await getItemComments(itemId);
  }


  return (
    <div className="flex my-8 w-[85%] justify-between">
      <div className="p-2  bg-black/20 w-full dark:shadow-none shadow-lg">
        <AddComment title="Add a comment" type={eventId ? CommentType.event : CommentType.item} id={itemId? itemId as string : eventId as string} />
      {/* hacky way to pass vars ↑ */}
        {comments ? (
          comments.comments.map((c) => (
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
    </div>
  );
};

export default Comments;
