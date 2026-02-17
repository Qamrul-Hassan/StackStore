import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Order Received</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Your order has been placed successfully.</p>
          {orderId ? <p className="text-sm text-muted-foreground">Order ID: {orderId}</p> : null}
          <Link href="/" className="underline">
            Back to shop
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
