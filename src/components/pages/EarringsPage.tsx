import { useEffect, useState } from "react";
import { motion } from "motion/react";
import ProductCard from "../shared/ProductCard";
import { Product } from "../../types/Product";
import { getProductsByCategory } from "../../services/productService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EarringsPageProps {
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function EarringsPage({
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isInWishlist,
}: EarringsPageProps) {
  const [earrings, setEarrings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarrings();
  }, []);

  const loadEarrings = async () => {
    try {
      setLoading(true);
      const products = await getProductsByCategory("Earrings");
      setEarrings(products);
    } catch (err) {
      console.error("Error fetching earrings:", err);
      toast.error("Failed to load earrings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      paddingTop: "80px",
      background: "#000000",
      color: "#f5f5f5",
    }}>
      {/* Hero Banner - Pure Black */}
      <section style={{
        padding: "60px 20px",
        background: "#000000",
        borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
        width: "100%",
        textAlign: "center",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontFamily: "var(--font-cursive)",
            fontWeight: "600",
            background: "linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "16px",
          }}>
            Beautiful <span style={{ color: "#D4AF37" }}>Earrings</span>
          </h1>
          <p style={{
            fontSize: "18px",
            color: "#a0a0a0",
            maxWidth: "600px",
            margin: "0 auto",
          }}>
            From subtle studs to statement pieces, find the perfect pair
          </p>
        </motion.div>
      </section>

      {/* Product Grid */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px 20px",
      }}>
        {loading ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 20px",
          }}>
            <Loader2 style={{
              width: "40px",
              height: "40px",
              color: "#D4AF37",
              animation: "spin 1s linear infinite",
            }} />
          </div>
        ) : earrings.length > 0 ? (
          <>
            <motion.div
              style={{
                marginBottom: "24px",
                textAlign: "center",
                padding: "16px",
                background: "#000000",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                borderRadius: "8px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p style={{
                color: "#a0a0a0",
                fontSize: "16px",
                margin: 0,
              }}>
                Showing <span style={{
                  color: "#D4AF37",
                  fontWeight: "700",
                  fontSize: "18px",
                }}>{earrings.length}</span> {earrings.length === 1 ? "pair" : "pairs"}
              </p>
            </motion.div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "16px",
            }}
            className="product-grid-responsive"
            >
              {earrings.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                  onToggleWishlist={onToggleWishlist}
                  isInWishlist={isInWishlist(product.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <motion.div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#000000",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              borderRadius: "12px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p style={{
              fontSize: "18px",
              color: "#a0a0a0",
            }}>
              No earrings available at the moment.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
