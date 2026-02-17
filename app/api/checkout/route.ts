import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { checkoutSchema } from "@/lib/schemas";
import { env } from "@/lib/env";
import { storeItems } from "@/lib/store-data";

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = checkoutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { items, customerEmail, paymentMethod } = parsed.data;

  try {
    const products = await db.product.findMany({
      where: {
        id: { in: items.map((i) => i.productId) },
        isActive: true
      }
    });

    if (products.length !== items.length) {
      throw new Error("FALLBACK_TO_DEMO");
    }

    const productsById = new Map(products.map((p) => [p.id, p]));
    let total = 0;

    for (const item of items) {
      const product = productsById.get(item.productId);
      if (!product) continue;
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
      total += Number(product.price) * item.quantity;
    }

    const order = await db.order.create({
      data: {
        customerEmail,
        paymentMethod: paymentMethod.toUpperCase() as "STRIPE" | "COD",
        totalAmount: total,
        items: {
          create: items.map((item) => {
            const product = productsById.get(item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: product.price
            };
          })
        }
      }
    });

    await db.$transaction(
      items.map((item) =>
        db.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      )
    );

    if (paymentMethod === "stripe") {
      if (!env.stripeSecretKey) {
        return NextResponse.json(
          {
            error:
              "Stripe is not configured. Set STRIPE_SECRET_KEY or use Cash On Delivery."
          },
          { status: 400 }
        );
      }

      const stripe = new Stripe(env.stripeSecretKey);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: customerEmail,
        success_url: `${env.appUrl}/checkout/success?orderId=${order.id}`,
        cancel_url: `${env.appUrl}/checkout`,
        metadata: { orderId: order.id },
        line_items: items.map((item) => {
          const product = productsById.get(item.productId)!;
          return {
            quantity: item.quantity,
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
                images: [product.imageUrl]
              },
              unit_amount: Math.round(Number(product.price) * 100)
            }
          };
        })
      });

      await db.order.update({
        where: { id: order.id },
        data: { paymentRef: session.id }
      });

      return NextResponse.json({
        orderId: order.id,
        checkoutUrl: session.url
      });
    }

    return NextResponse.json({ orderId: order.id });
  } catch {
    const demoMap = new Map(storeItems.map((p) => [p.id, p]));
    let total = 0;
    for (const item of items) {
      const product = demoMap.get(item.productId);
      if (!product) continue;
      total += product.price * item.quantity;
    }
    return NextResponse.json({
      orderId: `demo-${Date.now()}`,
      total,
      mode: "demo"
    });
  }
}
