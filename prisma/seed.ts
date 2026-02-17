import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeThisStrongPassword";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash,
      role: "ADMIN"
    }
  });

  const products = [
    {
      slug: "urban-trail-jacket",
      name: "Urban Trail Jacket",
      description: "Weather-resistant jacket designed for city commutes and travel.",
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
      price: 89.99,
      stock: 40,
      isActive: true
    },
    {
      slug: "minimalist-leather-bag",
      name: "Minimalist Leather Bag",
      description: "Structured full-grain leather bag with premium metal hardware.",
      imageUrl:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200&auto=format&fit=crop",
      price: 129.0,
      stock: 24,
      isActive: true
    },
    {
      slug: "performance-running-shoes",
      name: "Performance Running Shoes",
      description: "Lightweight running shoes with responsive cushioning and grip.",
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
      price: 99.5,
      stock: 52,
      isActive: true
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
