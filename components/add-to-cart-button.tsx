"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  className?: string;
  withIcon?: boolean;
};

export function AddToCartButton({ product, className, withIcon }: Props) {
  const cart = useCart();

  return (
    <Button
      className={className}
      onClick={() =>
        cart.addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl
        })
      }
    >
      {withIcon ? <ShoppingCart className="mr-2 size-4" /> : null}
      Add To Cart
    </Button>
  );
}
