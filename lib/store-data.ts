export type StoreItem = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  images?: string[];
  colors?: string[];
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  isNew?: boolean;
};

export const storeItems: StoreItem[] = [
  {
    id: "1",
    slug: "havit-hv-g92-gamepad",
    name: "HAVIT HV-G92 Gamepad",
    imageUrl: "/assets/products/havit-hv-g92-gamepad.svg",
    images: [
      "/assets/products/havit-hv-g92-gamepad.svg",
      "/assets/products/havit-hv-g92-gamepad.svg"
    ],
    colors: ["#111111", "#F92D0A", "#8EB4C2"],
    price: 120,
    oldPrice: 160,
    rating: 4.6,
    reviews: 88,
    badge: "-40%"
  },
  {
    id: "2",
    slug: "ak-900-wired-keyboard",
    name: "AK-900 Wired Keyboard",
    imageUrl: "/assets/products/ak-900-wired-keyboard.svg",
    colors: ["#111111", "#ffffff"],
    price: 960,
    oldPrice: 1160,
    rating: 4.2,
    reviews: 75,
    badge: "-35%"
  },
  {
    id: "3",
    slug: "ips-lcd-gaming-monitor",
    name: "IPS LCD Gaming Monitor",
    imageUrl: "/assets/products/ips-lcd-gaming-monitor.svg",
    price: 370,
    oldPrice: 400,
    rating: 4.3,
    reviews: 99,
    badge: "-30%"
  },
  {
    id: "4",
    slug: "rgb-liquid-cpu-cooler",
    name: "RGB Liquid CPU Cooler",
    imageUrl: "/assets/products/rgb-liquid-cpu-cooler.svg",
    colors: ["#111111", "#712825", "#8EB4C2"],
    price: 160,
    oldPrice: 170,
    rating: 4.1,
    reviews: 65
  },
  {
    id: "5",
    slug: "the-north-coat",
    name: "The North Coat",
    imageUrl: "/assets/products/the-north-coat.svg",
    colors: ["#111111", "#8EB4C2", "#28323F"],
    price: 260,
    oldPrice: 360,
    rating: 4.7,
    reviews: 65
  },
  {
    id: "6",
    slug: "gucci-duffle-bag",
    name: "Gucci Duffle Bag",
    imageUrl: "/assets/products/gucci-duffle-bag.svg",
    colors: ["#111111", "#8B4513"],
    price: 960,
    oldPrice: 1160,
    rating: 4.2,
    reviews: 65,
    badge: "-35%"
  },
  {
    id: "7",
    slug: "wh-1000xm-headphone",
    name: "WH-1000XM Headphone",
    imageUrl: "/assets/products/wh-1000xm-headphone.svg",
    colors: ["#111111", "#8EB4C2", "#F92D0A"],
    price: 320,
    oldPrice: 399,
    rating: 4.8,
    reviews: 182,
    badge: "-20%"
  },
  {
    id: "8",
    slug: "kids-electric-car",
    name: "Kids Electric Car",
    imageUrl: "/assets/products/kids-electric-car.svg",
    price: 960,
    rating: 4.8,
    reviews: 65,
    isNew: true
  }
];

export const categories = [
  "Phones",
  "Computers",
  "SmartWatch",
  "Camera",
  "HeadPhone",
  "Gaming"
];
