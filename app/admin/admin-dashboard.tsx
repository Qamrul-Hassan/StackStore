"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { ProductDTO } from "@/lib/serializers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  adminEmail: string;
  initialProducts: ProductDTO[];
  initialOrders: {
    id: string;
    customerEmail: string;
    status: string;
    paymentMethod: string;
    totalAmount: number;
    createdAt: string;
    items: { id: string; quantity: number; productName: string }[];
  }[];
  initialUsers: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    emailVerified: boolean;
    createdAt: string;
  }[];
};

type ProductFormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  isActive: boolean;
};

type PanelKey = "products" | "orders" | "users" | "account";
type ProductFilter = "all" | "active" | "hidden" | "low-stock";

const emptyState: ProductFormState = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  price: 0,
  stock: 0,
  isActive: true
};

const orderStatuses = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "FAILED",
  "CANCELLED"
] as const;

async function readSafeJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function orderStatusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  if (status === "FAILED" || status === "CANCELLED") return "destructive";
  if (status === "DELIVERED" || status === "PAID") return "secondary";
  if (status === "PENDING" || status === "PROCESSING") return "outline";
  return "default";
}

export function AdminDashboard({ adminEmail, initialProducts, initialOrders, initialUsers }: Props) {
  const [panel, setPanel] = useState<PanelKey>("products");

  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [users, setUsers] = useState(initialUsers);

  const [form, setForm] = useState<ProductFormState>(emptyState);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [productQuery, setProductQuery] = useState("");
  const [productFilter, setProductFilter] = useState<ProductFilter>("all");

  const [orderQuery, setOrderQuery] = useState("");
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>("ALL");
  const [userQuery, setUserQuery] = useState("");

  const [accountEmail, setAccountEmail] = useState(adminEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPasswordFocused, setCurrentPasswordFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountMessage, setAccountMessage] = useState("");
  const [accountError, setAccountError] = useState("");

  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  useEffect(() => {
    const sync = async () => {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (!res.ok) return;
      const payload = (await res.json()) as {
        products: ProductDTO[];
        orders: Props["initialOrders"];
        users: Props["initialUsers"];
      };
      setProducts(payload.products);
      setOrders(payload.orders);
      setUsers(payload.users);
      setLastSyncedAt(new Date());
    };

    const id = window.setInterval(() => {
      void sync();
    }, 8000);

    return () => window.clearInterval(id);
  }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.isActive).length;
    const lowStockProducts = products.filter((p) => p.stock <= 5).length;
    const totalOrders = orders.length;
    const totalUsers = users.length;
    const pendingOrders = orders.filter((o) => o.status === "PENDING" || o.status === "PROCESSING").length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      totalUsers,
      pendingOrders,
      totalRevenue
    };
  }, [orders, products, users]);

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    return products.filter((product) => {
      const textOk =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);

      if (!textOk) return false;
      if (productFilter === "active") return product.isActive;
      if (productFilter === "hidden") return !product.isActive;
      if (productFilter === "low-stock") return product.stock <= 5;
      return true;
    });
  }, [productFilter, productQuery, products]);

  const filteredOrders = useMemo(() => {
    const q = orderQuery.trim().toLowerCase();
    return orders.filter((order) => {
      const queryOk =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.items.some((item) => item.productName.toLowerCase().includes(q));

      if (!queryOk) return false;
      if (orderFilterStatus !== "ALL" && order.status !== orderFilterStatus) return false;
      return true;
    });
  }, [orderFilterStatus, orderQuery, orders]);

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    return users.filter((user) => {
      if (!q) return true;
      return (
        user.email.toLowerCase().includes(q) ||
        (user.name ?? "").toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q)
      );
    });
  }, [userQuery, users]);

  function setField<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function updateAdminAccount(e: React.FormEvent) {
    e.preventDefault();
    setAccountSaving(true);
    setAccountMessage("");
    setAccountError("");

    const res = await fetch("/api/admin/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: accountEmail,
        currentPassword,
        newPassword,
        confirmPassword
      })
    });

    const payload = await readSafeJson<{ error?: string; message?: string; email?: string }>(res);
    setAccountSaving(false);

    if (!res.ok) {
      setAccountError(payload?.error ?? "Failed to update admin account.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    if (payload?.email) {
      setAccountEmail(payload.email);
    }
    setAccountMessage(payload?.message ?? "Admin account updated.");
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/admin/products/${form.id}` : "/api/admin/products";

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      imageUrl: form.imageUrl,
      price: Number(form.price),
      stock: Number(form.stock),
      isActive: form.isActive
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return;

    if (isEditing) {
      setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));
    } else {
      setProducts((prev) => [data, ...prev]);
    }

    setForm(emptyState);
  }

  function startEdit(product: ProductDTO) {
    setPanel("products");
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      imageUrl: product.imageUrl,
      price: product.price,
      stock: product.stock,
      isActive: product.isActive
    });
  }

  async function removeProduct(id: string) {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (form.id === id) setForm(emptyState);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) return;

    setField("imageUrl", data.imageUrl);
  }

  async function updateOrderStatus(orderId: string, status: string) {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok) return;

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }

  async function removeUser(userId: string) {
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    const payload = await readSafeJson<{ error?: string }>(res);
    if (!res.ok) {
      window.alert(payload?.error ?? "Failed to delete user.");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-white/30 bg-[linear-gradient(120deg,rgba(33,14,20,0.92)_0%,rgba(40,50,63,0.95)_45%,rgba(249,45,10,0.84)_100%)] p-5 text-white shadow-[0_26px_50px_-30px_rgba(20,10,16,0.85)] sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-white/70">StackStore Console</p>
            <h1 className="text-2xl font-semibold sm:text-3xl">Modern Admin Panel</h1>
            <p className="text-sm text-white/80">
              Manage products, orders, and admin credentials in one place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {lastSyncedAt ? `Last sync ${lastSyncedAt.toLocaleTimeString()}` : "Auto sync every 8s"}
            </Badge>
            <Button variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/15" onClick={() => signOut({ callbackUrl: "/admin" })}>
              Logout
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
        <Card className="xl:col-span-1">
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Products</p>
            <p className="mt-2 text-2xl font-bold">{stats.totalProducts}</p>
          </CardContent>
        </Card>
        <Card className="xl:col-span-1">
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Active</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{stats.activeProducts}</p>
          </CardContent>
        </Card>
        <Card className="xl:col-span-1">
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Low Stock</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">{stats.lowStockProducts}</p>
          </CardContent>
        </Card>
        <Card className="xl:col-span-1">
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Orders</p>
            <p className="mt-2 text-2xl font-bold">{stats.totalOrders}</p>
          </CardContent>
        </Card>
        <Card className="xl:col-span-1">
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Pending</p>
            <p className="mt-2 text-2xl font-bold text-[#F92D0A]">{stats.pendingOrders}</p>
          </CardContent>
        </Card>
        <Card className="xl:col-span-1">
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Users</p>
            <p className="mt-2 text-2xl font-bold text-indigo-600">{stats.totalUsers}</p>
          </CardContent>
        </Card>
        <Card className="xl:col-span-1">
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Revenue</p>
            <p className="mt-2 text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={panel === "products" ? "default" : "outline"}
          onClick={() => setPanel("products")}
        >
          Products
        </Button>
        <Button
          type="button"
          variant={panel === "orders" ? "default" : "outline"}
          onClick={() => setPanel("orders")}
        >
          Orders
        </Button>
        <Button
          type="button"
          variant={panel === "users" ? "default" : "outline"}
          onClick={() => setPanel("users")}
        >
          Users
        </Button>
        <Button
          type="button"
          variant={panel === "account" ? "default" : "outline"}
          onClick={() => setPanel("account")}
        >
          Admin Account
        </Button>
      </section>

      {panel === "products" ? (
        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>Product Management</CardTitle>
                <Badge variant="outline">{filteredProducts.length} shown</Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Search by name, slug, description"
                />
                <select
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value as ProductFilter)}
                >
                  <option value="all">All products</option>
                  <option value="active">Active only</option>
                  <option value="hidden">Hidden only</option>
                  <option value="low-stock">Low stock (&lt;=5)</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-zinc-500">/{product.slug}</p>
                          </div>
                        </TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={product.stock <= 5 ? "font-semibold text-amber-600" : ""}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.isActive ? "secondary" : "outline"}>
                            {product.isActive ? "Active" : "Hidden"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => startEdit(product)}>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeProduct(product.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-zinc-500">
                          No products found for this filter.
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Product" : "Add Product"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={saveProduct}>
                <div className="space-y-2">
                  <Label htmlFor="product-name">Name</Label>
                  <Input id="product-name" name="product-name" value={form.name} onChange={(e) => setField("name", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-slug">Slug</Label>
                  <Input id="product-slug" name="product-slug" value={form.slug} onChange={(e) => setField("slug", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    name="product-description"
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-image-url">Image URL</Label>
                  <Input
                    id="product-image-url"
                    name="product-image-url"
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setField("imageUrl", e.target.value)}
                    required
                  />
                  <Input
                    id="product-image-file"
                    name="product-image-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      void uploadImage(file);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {uploading ? "Uploading image..." : "Upload an image or paste URL"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Price</Label>
                    <Input
                      id="product-price"
                      name="product-price"
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setField("price", Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-stock">Stock</Label>
                    <Input
                      id="product-stock"
                      name="product-stock"
                      type="number"
                      value={form.stock}
                      onChange={(e) => setField("stock", Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setField("isActive", e.target.checked)}
                  />
                  Product is active
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setForm(emptyState)}>
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {panel === "orders" ? (
        <section>
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>Orders</CardTitle>
                <Badge variant="outline">{filteredOrders.length} shown</Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="Search by order id, customer email, or product"
                />
                <select
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                >
                  <option value="ALL">All statuses</option>
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
                        <TableCell>{order.customerEmail}</TableCell>
                        <TableCell>
                          {order.items.map((item) => `${item.productName} x${item.quantity}`).join(", ")}
                        </TableCell>
                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>{order.paymentMethod}</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Badge variant={orderStatusVariant(order.status)}>{order.status}</Badge>
                            <select
                              className="h-9 w-full rounded-md border bg-background px-2 text-sm"
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            >
                              {orderStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center text-zinc-500">
                          No orders found for this filter.
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {panel === "users" ? (
        <section>
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>Registered Users</CardTitle>
                <Badge variant="outline">{filteredUsers.length} shown</Badge>
              </div>
              <Input
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Search by email, name, or role"
              />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name ?? "-"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "ADMIN" ? "secondary" : "outline"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.emailVerified ? "secondary" : "destructive"}>
                            {user.emailVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeUser(user.id)}
                            disabled={user.role === "ADMIN" || user.email.toLowerCase() === adminEmail.toLowerCase()}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-zinc-500">
                          No users found for this filter.
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {panel === "account" ? (
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Admin Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={updateAdminAccount}>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    name="admin-email"
                    type="email"
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    required
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="admin-current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-current-password"
                        name="admin-current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        onFocus={() => setCurrentPasswordFocused(true)}
                        onBlur={() => setCurrentPasswordFocused(false)}
                        placeholder="Required for password change"
                        className={currentPassword || currentPasswordFocused ? "pr-12" : ""}
                      />
                      {currentPassword || currentPasswordFocused ? (
                        <button
                          type="button"
                          aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowCurrentPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-[#d6deea] bg-[linear-gradient(145deg,#ffffff,#eef3f9)] text-[#3f4b5d] shadow-[0_8px_16px_-10px_rgba(24,32,44,0.55)] transition hover:scale-105 hover:border-[#FB8500]/70 hover:text-[#F92D0A]"
                        >
                          {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-new-password"
                        name="admin-new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setNewPasswordFocused(true)}
                        onBlur={() => setNewPasswordFocused(false)}
                        placeholder="Leave blank to keep"
                        className={newPassword || newPasswordFocused ? "pr-12" : ""}
                      />
                      {newPassword || newPasswordFocused ? (
                        <button
                          type="button"
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-[#d6deea] bg-[linear-gradient(145deg,#ffffff,#eef3f9)] text-[#3f4b5d] shadow-[0_8px_16px_-10px_rgba(24,32,44,0.55)] transition hover:scale-105 hover:border-[#FB8500]/70 hover:text-[#F92D0A]"
                        >
                          {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-confirm-password"
                        name="admin-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setConfirmPasswordFocused(true)}
                        onBlur={() => setConfirmPasswordFocused(false)}
                        placeholder="Repeat new password"
                        className={confirmPassword || confirmPasswordFocused ? "pr-12" : ""}
                      />
                      {confirmPassword || confirmPasswordFocused ? (
                        <button
                          type="button"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-[#d6deea] bg-[linear-gradient(145deg,#ffffff,#eef3f9)] text-[#3f4b5d] shadow-[0_8px_16px_-10px_rgba(24,32,44,0.55)] transition hover:scale-105 hover:border-[#FB8500]/70 hover:text-[#F92D0A]"
                        >
                          {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be 8+ chars and include uppercase, lowercase, number, and special symbol.
                </p>
                <Button type="submit" disabled={accountSaving}>
                  {accountSaving ? "Updating..." : "Update Admin Account"}
                </Button>
                {accountError ? <p className="text-sm text-red-500">{accountError}</p> : null}
                {accountMessage ? <p className="text-sm text-emerald-600">{accountMessage}</p> : null}
              </form>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}

