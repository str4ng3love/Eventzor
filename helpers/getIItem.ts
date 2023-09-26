import { prisma } from "@/lib/ConnectPrisma";


export default async function getItem(name: string){
    console.log(name)
    const item = await prisma.marketItem.findFirst({where:{item: name }})

    return item
}