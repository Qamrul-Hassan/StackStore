import { Product } from "@prisma/client";

export type ProductDTO = Omit<Product, "price"> & { price: number };

export function toProductDTO(product: Product): ProductDTO {
  return { ...product, price: Number(product.price) };
}
