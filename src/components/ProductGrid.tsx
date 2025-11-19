import { useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "../types/Product";
import { Button } from "./ui/button";
import { motion } from "motion/react";

// Example SubCategory list - adapt based on actual SubCategory names or IDs
const categories = [
  { id: 0, name: "All" },
  { id: 1, name: "Rings" },
  { id: 2, name: "Necklaces" },
  { id: 3, name: "Bracelets" },
  { id: 4, name: "Earrings" },
  { id: 5, name: "Watches" },
];

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart, onQuickView }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState(0);

  const filteredProducts =
    selectedCategory === 0
      ? products
      : products.filter((p) => p.SubCat_Id === selectedCategory);

  return (
    <section className="py-10 px-4 sm:py-20">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4">
            Our <span className="text-primary">Collection</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each piece is meticulously crafted to perfection, blending timeless design with modern elegance
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`${
                selectedCategory === category.id
                  ? "bg-primary text-black hover:bg-primary/90"
                  : "border-primary/50 text-foreground hover:bg-primary hover:text-black"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.LotNo}
              product={product}
              onClick={() => onQuickView(product)}
            />
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-black px-12"
          >
            Load More
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
