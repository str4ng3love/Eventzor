import { prisma } from "@/lib/ConnectPrisma";


export default async function getItem(name: string){
    
    const item = await prisma.marketItem.findFirst({where:{item: name }, include:{_count:{select:{likes:true, dislikes:true}}}})

    return item
}
export const getNewestItems = async () => {
    const items = await prisma.marketItem.findMany({
        orderBy: { id: "desc" },
        take: 10,
        where: { images: { isEmpty: false } }
    });
    return {
        items,
    };
}