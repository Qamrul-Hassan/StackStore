import { ProductDTO } from "@/lib/serializers";

export const demoProducts: ProductDTO[] = [
  {
    id: "demo-1",
    slug: "urban-trail-jacket",
    name: "Urban Trail Jacket",
    description: "Weather-resistant jacket designed for city commutes and travel.",
    imageUrl: "https://loremflickr.com/1200/800/coat,jacket,fashion,clothing?lock=215",
    price: 89.99,
    stock: 40,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "demo-2",
    slug: "minimalist-leather-bag",
    name: "Minimalist Leather Bag",
    description: "Structured full-grain leather bag with premium metal hardware.",
    imageUrl: "https://loremflickr.com/1200/800/bag,leather,duffle,travel?lock=216",
    price: 129,
    stock: 24,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "demo-3",
    slug: "performance-running-shoes",
    name: "Performance Running Shoes",
    description: "Lightweight running shoes with responsive cushioning and grip.",
    imageUrl: "https://loremflickr.com/1400/700/woman,fashion?lock=311",
    price: 99.5,
    stock: 52,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
