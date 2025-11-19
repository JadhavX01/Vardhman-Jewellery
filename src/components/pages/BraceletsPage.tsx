import { useState, useEffect } from "react";
import { motion } from "motion/react";
import ProductCard from "../shared/ProductCard";
import { Product } from "../../types/Product";
import { getProductsByCategory } from "../../services/productService";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface BraceletsPageProps {
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

export function BraceletsPage({
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isInWishlist,
}: BraceletsPageProps) {
  const [bracelets, setBracelets] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBracelets = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await getProductsByCategory("Bracelets", { limit: 50 });
        setBracelets(products);
      } catch (err) {
        console.error("Failed to load bracelets:", err);
        setError("Failed to load bracelets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadBracelets();
  }, []);

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
            Elegant <span style={{ color: "#D4AF37" }}>Bracelets</span>
          </h1>
          <p style={{
            fontSize: "18px",
            color: "#a0a0a0",
            maxWidth: "600px",
            margin: "0 auto",
          }}>
            Timeless bracelets that add grace and charm to your wrist
          </p>
        </motion.div>
      </section>

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px 20px",
      }}>
        {loading && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 20px",
            gap: "12px",
          }}>
            <Loader2 style={{
              width: "40px",
              height: "40px",
              color: "#D4AF37",
              animation: "spin 1s linear infinite",
            }} />
            <span style={{ color: "#a0a0a0" }}>Loading bracelets...</span>
          </div>
        )}

        {error && !loading && (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#000000",
            border: "1px solid rgba(220, 38, 38, 0.3)",
            borderRadius: "12px",
          }}>
            <p style={{ color: "#dc2626", marginBottom: "16px", fontSize: "16px" }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "12px 24px",
                background: "transparent",
                color: "#D4AF37",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && bracelets.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "16px",
          }}
          className="product-grid-responsive"
          >
            {bracelets.map((product) => (
              <ProductCard
                key={product.LotNo}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onToggleWishlist={onToggleWishlist}
                isInWishlist={isInWishlist(product.LotNo)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
