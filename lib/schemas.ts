import { z } from "zod";

export const productInputSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140),
  description: z.string().min(10).max(2000),
  imageUrl: z.string().url(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  isActive: z.boolean().default(true)
});

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive()
    })
  ),
  customerEmail: z.string().email(),
  paymentMethod: z.enum(["stripe", "cod"])
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
