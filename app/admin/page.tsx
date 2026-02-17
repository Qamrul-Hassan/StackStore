import { AdminDashboard } from "@/app/admin/admin-dashboard";
import { AdminLoginForm } from "@/app/admin/admin-login-form";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { toProductDTO } from "@/lib/serializers";

export default async function AdminPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  if (!isAdmin) return <AdminLoginForm />;

  let initialProducts: Awaited<ReturnType<typeof db.product.findMany>> = [];
  let initialOrders: {
    id: string;
    customerEmail: string;
    status: string;
    paymentMethod: string;
    totalAmount: number;
    createdAt: string;
    items: { id: string; quantity: number; productName: string }[];
  }[] = [];

  try {
    initialProducts = await db.product.findMany({
      orderBy: { createdAt: "desc" }
    });

    const orders = await db.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    initialOrders = orders.map((order) => ({
      id: order.id,
      customerEmail: order.customerEmail,
      status: order.status,
      paymentMethod: order.paymentMethod,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        productName: item.product.name
      }))
    }));
  } catch {
    initialProducts = [];
    initialOrders = [];
  }

  return (
    <AdminDashboard
      initialProducts={initialProducts.map(toProductDTO)}
      initialOrders={initialOrders}
    />
  );
}
