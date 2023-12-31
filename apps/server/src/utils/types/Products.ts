import { z } from "zod";

export const ProductsSchema = z.enum(["Free", "Trial", "Paid", "Expired"]);

export const Products = ProductsSchema.enum;

export type Products = z.infer<typeof ProductsSchema>;

export const ProductsDescription = {
  Free: "Free version.",
  Trial: "1 month free trial.",
  Paid: "$2 per month.",
  Expired: "Free trial has expired.",
} as const;
