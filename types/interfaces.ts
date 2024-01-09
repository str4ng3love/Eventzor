import { Order } from "@prisma/client";

interface ParsedOrder extends Omit<Order, "orderedAt">{
    orderedAt: string
    amounts: { id: string; item: string; amount: number; price: number; }[]
}

export type {ParsedOrder}