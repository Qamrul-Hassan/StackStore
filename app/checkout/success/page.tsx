import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <div className="section-single-cart cart-right mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Order Received</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Your order has been placed successfully.</p>
          {orderId ? <p className="text-sm text-muted-foreground">Order ID: {orderId}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Link href="/account" className="underline">
              View my orders
            </Link>
            <Link href="/" className="underline">
              Back to shop
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
