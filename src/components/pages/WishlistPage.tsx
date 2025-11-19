import { motion } from "motion/react";
import  ProductCard  from "../shared/ProductCard";
import { Product } from "../../types/Product";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface WishlistPageProps {
  wishlistItems: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

export function WishlistPage({ wishlistItems, onAddToCart, onQuickView, onToggleWishlist }: WishlistPageProps) {
  return (
    <div className="min-h-screen pt-20" style={{
      background: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)",
    }}>
      {/* Header - Pure Black */}
      <section style={{
        background: "#000000",
        padding: "60px 20px",
        borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
        width: "100%",
      }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1400px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div style={{
              width: "100px",
              height: "100px",
              background: "linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)",
              border: "2px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: "0 8px 30px rgba(212, 175, 55, 0.15)",
            }}>
              <Heart className="w-12 h-12" style={{ color: "#D4AF37", fill: "#D4AF37" }} />
            </div>
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
              Your <span style={{ color: "#D4AF37" }}>Wishlist</span>
            </h1>
            <p style={{
              color: "#a0a0a0",
              fontSize: "18px",
            }}>
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wishlist Items */}
      <div className="container mx-auto px-4 py-12" style={{ maxWidth: "1400px" }}>
        {wishlistItems.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "16px",
          }}
          className="product-grid-responsive"
          >
            {wishlistItems.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                  onToggleWishlist={onToggleWishlist}
                  isInWishlist={true}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#000000",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              borderRadius: "12px",
            }}
          >
            <div style={{
              width: "100px",
              height: "100px",
              background: "linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)",
              border: "2px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <Heart className="w-12 h-12" style={{ color: "#D4AF37" }} />
            </div>
            <h3 style={{
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontFamily: "var(--font-cursive)",
              fontWeight: "600",
              background: "linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "16px",
            }}>
              Your wishlist is empty
            </h3>
            <p style={{
              color: "#a0a0a0",
              fontSize: "16px",
              marginBottom: "32px",
              maxWidth: "500px",
              margin: "0 auto 32px",
            }}>
              Start adding items to your wishlist by clicking the heart icon on products you love
            </p>
            <Link to="/collections">
              <button style={{
                padding: "14px 32px",
                background: "linear-gradient(135deg, #D4AF37 0%, #c19820 100%)",
                color: "#0a0a0a",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)",
                transition: "all 0.3s ease",
                textDecoration: "none",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(212, 175, 55, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
              >
                Explore Products
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
