"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { animateFlyToTarget } from "@/lib/fly-to-target";

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
  const [isAdded, setIsAdded] = useState(false);

  return (
    <Button
      className={`${className ?? ""} ${isAdded ? "scale-[1.02] brightness-110" : ""}`}
      onClick={(e) => {
        cart.addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl
        });
        setIsAdded(true);
        window.setTimeout(() => setIsAdded(false), 350);
        animateFlyToTarget(e.currentTarget, '[data-fly-target="cart"]', {
          color: "#FB8500",
          size: 15,
          kind: "product",
          imageUrl: product.imageUrl
        });
      }}
    >
      {withIcon ? <ShoppingCart className="mr-2 size-4" /> : null}
      {isAdded ? "Added" : "Add To Cart"}
    </Button>
  );
}
