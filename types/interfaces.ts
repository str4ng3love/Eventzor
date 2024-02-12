import { Comment, Order } from "@prisma/client";

interface OrdersParsedAmounts {
    id: string; item: string; amount: number; price: number; type: string
}

interface ParsedOrder extends Omit<Order, "orderedAt"> {
    orderedAt: string
    amounts: { id: string; item: string; amount: number; price: number; }[]
}

interface CommentProps extends Comment {
    _count: {
        likes: number, dislikes: number, children: number
    }
}

interface CartOrder {
    id: string
    amount: number,
    type: string,
    price: number,
    item: string
}
export type { ParsedOrder, OrdersParsedAmounts, CommentProps, CartOrder }