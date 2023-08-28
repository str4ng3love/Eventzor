import { prisma } from "@/lib/ConnectPrisma";


export default async function getEvent(title: string){
    const event = await prisma.event.findFirst({where:{title: title }})

    return {event}
}