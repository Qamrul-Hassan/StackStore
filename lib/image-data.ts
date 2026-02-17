export function productImageBySlug(slug: string) {
  return `/api/image/product-${slug}`;
}

export const sectionImages = {
  hero: "/api/image/section-hero",
  music: "/api/image/section-music",
  playstation: "/api/image/section-playstation",
  women: "/api/image/section-women",
  speakers: "/api/image/section-speakers",
  perfume: "/api/image/section-perfume",
  about: "/api/image/section-about",
  teamTom: "/api/image/section-team-tom",
  teamEmma: "/api/image/section-team-emma",
  teamWill: "/api/image/section-team-will"
};

export type ImageSpec = {
  title: string;
  subtitle: string;
  c1: string;
  c2: string;
};

export function getImageSpec(id: string): ImageSpec {
  const map: Record<string, ImageSpec> = {
    "product-havit-hv-g92-gamepad": {
      title: "HV-G92 Gamepad",
      subtitle: "Controller",
      c1: "#210E14",
      c2: "#F92D0A"
    },
    "product-ak-900-wired-keyboard": {
      title: "AK-900 Keyboard",
      subtitle: "Mechanical",
      c1: "#28323F",
      c2: "#FB8500"
    },
    "product-ips-lcd-gaming-monitor": {
      title: "IPS LCD Monitor",
      subtitle: "Gaming Display",
      c1: "#210E14",
      c2: "#8EB4C2"
    },
    "product-rgb-liquid-cpu-cooler": {
      title: "RGB Liquid Cooler",
      subtitle: "PC Cooling",
      c1: "#28323F",
      c2: "#F92D0A"
    },
    "product-the-north-coat": {
      title: "North Coat",
      subtitle: "Winter Jacket",
      c1: "#712825",
      c2: "#FB8500"
    },
    "product-gucci-duffle-bag": {
      title: "Gucci Duffle Bag",
      subtitle: "Travel Gear",
      c1: "#210E14",
      c2: "#8EB4C2"
    },
    "product-small-bookself": {
      title: "Small Bookshelf",
      subtitle: "Home Furniture",
      c1: "#28323F",
      c2: "#748692"
    },
    "product-kids-electric-car": {
      title: "Kids Electric Car",
      subtitle: "Ride On",
      c1: "#210E14",
      c2: "#F92D0A"
    },
    "section-hero": { title: "Up To 10% Off", subtitle: "Premium Devices", c1: "#210E14", c2: "#F92D0A" },
    "section-music": { title: "Enhance Music", subtitle: "Immersive Sound", c1: "#28323F", c2: "#FB8500" },
    "section-playstation": { title: "PlayStation 5", subtitle: "Next-Gen Console", c1: "#210E14", c2: "#712825" },
    "section-women": { title: "Womens Collection", subtitle: "New Arrivals", c1: "#712825", c2: "#8EB4C2" },
    "section-speakers": { title: "Speakers", subtitle: "Smart Audio", c1: "#28323F", c2: "#F92D0A" },
    "section-perfume": { title: "Perfume", subtitle: "Luxury Notes", c1: "#210E14", c2: "#8EB4C2" },
    "section-about": { title: "Our Story", subtitle: "StackStore Journey", c1: "#210E14", c2: "#FB8500" },
    "section-team-tom": { title: "Tom Cruise", subtitle: "Founder", c1: "#28323F", c2: "#712825" },
    "section-team-emma": { title: "Emma Watson", subtitle: "Managing Director", c1: "#712825", c2: "#8EB4C2" },
    "section-team-will": { title: "Will Smith", subtitle: "Product Designer", c1: "#210E14", c2: "#F92D0A" }
  };

  return map[id] ?? { title: "StackStore", subtitle: "Premium Product", c1: "#210E14", c2: "#F92D0A" };
}
