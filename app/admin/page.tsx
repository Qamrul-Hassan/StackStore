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
  let initialUsers: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    emailVerified: boolean;
    createdAt: string;
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
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" },
      take: 100
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
    initialUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: Boolean(user.emailVerified),
      createdAt: user.createdAt.toISOString()
    }));
  } catch {
    initialProducts = [];
    initialOrders = [];
    initialUsers = [];
  }

  return (
    <AdminDashboard
      adminEmail={session.user?.email ?? ""}
      initialProducts={initialProducts.map(toProductDTO)}
      initialOrders={initialOrders}
      initialUsers={initialUsers}
    />
  );
}
