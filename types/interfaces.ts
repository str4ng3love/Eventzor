import { Comment, Order } from "@prisma/client";

interface ParsedOrder extends Omit<Order, "orderedAt"> {
    orderedAt: string
    amounts: { id: string; item: string; amount: number; price: number; }[]
}


interface CommentProps extends Comment {
    _count: {
        likes: number, dislikes: number, children: number
    }
}

export type { ParsedOrder, CommentProps }