"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { ProductDTO } from "@/lib/serializers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type Props = {
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

export function AdminDashboard({ initialProducts, initialOrders }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [form, setForm] = useState<ProductFormState>(emptyState);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  useEffect(() => {
    const sync = async () => {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (!res.ok) return;
      const payload = (await res.json()) as {
        products: ProductDTO[];
        orders: Props["initialOrders"];
      };
      setProducts(payload.products);
      setOrders(payload.orders);
    };

    const id = window.setInterval(() => {
      void sync();
    }, 8000);

    return () => window.clearInterval(id);
  }, []);

  function setField<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Product Panel</h1>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/admin" })}>
          Logout
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
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
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.isActive ? "Active" : "Hidden"}</TableCell>
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Product" : "Add Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={saveProduct}>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setField("name", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setField("slug", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setField("imageUrl", e.target.value)}
                  required
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    void uploadImage(file);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  {uploading ? "Uploading to Cloudinary..." : "Upload an image or paste URL"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setField("price", Number(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
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
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : isEditing ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setForm(emptyState)}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
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
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell>{order.customerEmail}</TableCell>
                  <TableCell>
                    {order.items
                      .map((item) => `${item.productName} x${item.quantity}`)
                      .join(", ")}
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>
                    <select
                      className="h-9 rounded-md border bg-background px-2 text-sm"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
