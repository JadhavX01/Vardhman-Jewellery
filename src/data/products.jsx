// Mock product database for the jewelry store
export const products = [
  // Rings
  {
    id: 1,
    name: "Diamond Eternity Ring",
    price: 2850,
    category: "Rings",
    image: "https://images.unsplash.com/photo-1629201690245-fa87a9c6598e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzU5OTA3OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Exquisite 18K white gold eternity ring adorned with brilliant-cut diamonds, symbolizing eternal love and commitment.",
    material: "18K White Gold",
    inStock: true,
    rating: 5
  },
  {
    id: 6,
    name: "Rose Gold Band",
    price: 2200,
    category: "Rings",
    image: "https://images.unsplash.com/photo-1758995115475-7b7d6eb060ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwcmluZyUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU5OTk5NzM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Delicate rose gold band with minimalist design, perfect for stacking or wearing alone.",
    material: "14K Rose Gold",
    inStock: true,
    rating: 4
  },
  {
    id: 11,
    name: "Sapphire Engagement Ring",
    price: 4500,
    category: "Rings",
    image: "https://images.unsplash.com/photo-1629201690245-fa87a9c6598e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzU5OTA3OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Royal blue sapphire surrounded by diamond halo in platinum setting.",
    material: "Platinum",
    inStock: true,
    rating: 5
  },
  {
    id: 12,
    name: "Wedding Band Set",
    price: 3200,
    category: "Rings",
    image: "https://images.unsplash.com/photo-1758995115475-7b7d6eb060ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwcmluZyUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU5OTk5NzM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Matching his and hers wedding bands in yellow gold with subtle engravings.",
    material: "18K Yellow Gold",
    inStock: true,
    rating: 5
  },

  // Necklaces
  {
    id: 2,
    name: "Golden Chain Necklace",
    price: 3200,
    category: "Necklaces",
    image: "https://images.unsplash.com/photo-1602752250055-5ebb552fc3ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnb2xkJTIwbmVja2xhY2V8ZW58MXx8fHwxNzU5OTk4OTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Stunning 22K gold chain necklace with intricate links, perfect for both casual and formal occasions.",
    material: "22K Gold",
    inStock: true,
    rating: 5
  },
  {
    id: 7,
    name: "Emerald Pendant",
    price: 3850,
    category: "Necklaces",
    image: "https://images.unsplash.com/photo-1590156118368-607652ab307a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwbmVja2xhY2UlMjBsdXh1cnl8ZW58MXx8fHwxNzU5OTMxMzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Magnificent emerald pendant surrounded by a halo of diamonds, suspended on a delicate gold chain.",
    material: "18K White Gold",
    inStock: true,
    rating: 5
  },
  {
    id: 13,
    name: "Diamond Solitaire Necklace",
    price: 5200,
    category: "Necklaces",
    image: "https://images.unsplash.com/photo-1602752250055-5ebb552fc3ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnb2xkJTIwbmVja2xhY2V8ZW58MXx8fHwxNzU5OTk4OTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Classic solitaire diamond pendant on delicate chain, timeless elegance.",
    material: "14K White Gold",
    inStock: true,
    rating: 5
  },
  {
    id: 14,
    name: "Pearl Strand Necklace",
    price: 2800,
    category: "Necklaces",
    image: "https://images.unsplash.com/photo-1590156118368-607652ab307a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwbmVja2xhY2UlMjBsdXh1cnl8ZW58MXx8fHwxNzU5OTMxMzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Classic strand of matched cultured pearls with gold clasp.",
    material: "Cultured Pearls",
    inStock: true,
    rating: 4
  },

  // Bracelets
  {
    id: 3,
    name: "Sapphire Bracelet",
    price: 4100,
    category: "Bracelets",
    image: "https://images.unsplash.com/photo-1611107683227-e9060eccd846?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYnJhY2VsZXR8ZW58MXx8fHwxNzU5OTM0MTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Elegant gold bracelet featuring rare blue sapphires, handcrafted by master artisans with meticulous attention to detail.",
    material: "18K Yellow Gold",
    inStock: true,
    rating: 5
  },
  {
    id: 8,
    name: "Tennis Bracelet",
    price: 5200,
    category: "Bracelets",
    image: "https://images.unsplash.com/photo-1758995119744-6454f091303f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwYnJhY2VsZXQlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc1OTk5OTczNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Classic diamond tennis bracelet featuring perfectly matched stones in a platinum setting.",
    material: "Platinum",
    inStock: true,
    rating: 5
  },
  {
    id: 15,
    name: "Charm Bracelet",
    price: 1850,
    category: "Bracelets",
    image: "https://images.unsplash.com/photo-1611107683227-e9060eccd846?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYnJhY2VsZXR8ZW58MXx8fHwxNzU5OTM0MTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Customizable charm bracelet with various gold charms included.",
    material: "14K Gold",
    inStock: true,
    rating: 4
  },
  {
    id: 16,
    name: "Bangle Set",
    price: 2600,
    category: "Bracelets",
    image: "https://images.unsplash.com/photo-1758995119744-6454f091303f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwYnJhY2VsZXQlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc1OTk5OTczNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Set of three gold bangles with textured finish.",
    material: "22K Gold",
    inStock: true,
    rating: 5
  },

  // Earrings
  {
    id: 4,
    name: "Pearl Drop Earrings",
    price: 1850,
    category: "Earrings",
    image: "https://images.unsplash.com/photo-1701450723521-788008974862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGVhcnJpbmdzfGVufDF8fHx8MTc1OTk5NTc2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Classic pearl drop earrings with lustrous freshwater pearls set in 14K gold, timeless elegance for any ensemble.",
    material: "14K Gold",
    inStock: true,
    rating: 5
  },
  {
    id: 17,
    name: "Diamond Studs",
    price: 3500,
    category: "Earrings",
    image: "https://images.unsplash.com/photo-1684439673104-f5d22791c71a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZWFycmluZ3N8ZW58MXx8fHwxNzU5OTk5NzQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Brilliant round cut diamond stud earrings in white gold setting.",
    material: "18K White Gold",
    inStock: true,
    rating: 5
  },
  {
    id: 18,
    name: "Hoop Earrings",
    price: 1200,
    category: "Earrings",
    image: "https://images.unsplash.com/photo-1701450723521-788008974862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGVhcnJpbmdzfGVufDF8fHx8MTc1OTk5NTc2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Classic gold hoop earrings with polished finish.",
    material: "14K Yellow Gold",
    inStock: true,
    rating: 4
  },
  {
    id: 19,
    name: "Chandelier Earrings",
    price: 4200,
    category: "Earrings",
    image: "https://images.unsplash.com/photo-1684439673104-f5d22791c71a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZWFycmluZ3N8ZW58MXx8fHwxNzU5OTk5NzQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Stunning chandelier earrings with cascading diamonds and gemstones.",
    material: "18K White Gold",
    inStock: true,
    rating: 5
  },

  // Watches
  {
    id: 5,
    name: "Luxury Timepiece",
    price: 8500,
    category: "Watches",
    image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NTk5Nzk5NDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Swiss-made luxury watch with automatic movement, gold accents, and sapphire crystal glass.",
    material: "Stainless Steel & Gold",
    inStock: true,
    rating: 5
  },
  {
    id: 20,
    name: "Diamond Watch",
    price: 12500,
    category: "Watches",
    image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NTk5Nzk5NDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Exquisite timepiece with diamond-encrusted bezel and mother-of-pearl dial.",
    material: "18K Gold & Diamonds",
    inStock: true,
    rating: 5
  }
];

export const categories = [
  { name: "All", slug: "all" },
  { name: "Rings", slug: "rings" },
  { name: "Necklaces", slug: "necklaces" },
  { name: "Bracelets", slug: "bracelets" },
  { name: "Earrings", slug: "earrings" },
  { name: "Watches", slug: "watches" }
];

// Provide a compatible named export for consumers expecting `allProducts`
export const allProducts = products;

// Optional default export for convenience
export default products;
