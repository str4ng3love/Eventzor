import { prisma } from "@/lib/ConnectPrisma";

export default async function getEvent(title: string) {
  const event = await prisma.event.findFirst({
    where: { title: title },
    include: { _count: { select: { likes: true, dislikes: true } } },
  });

  return event;
}

export const getNewestEvents = async () => {
  const events = await prisma.event.findMany({
    orderBy: { id: "desc" },
    take: 10,
    where: { images: { isEmpty: false } },
  });
  return {
    events,
  };
};
