import { motion } from "motion/react";
import  ProductCard  from "../shared/ProductCard";
import { Product } from "../../types/Product";
import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { searchProducts } from "../../services/productService";
import { toast } from "sonner";

interface SearchPageProps {
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string | number) => boolean;
}

export function SearchPage({ onAddToCart, onQuickView, onToggleWishlist, isInWishlist }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Fetch all products on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const { getAllProducts } = await import("../../services/productService");
        const products = await getAllProducts({ limit: 1000 });
        setAllProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products. Please check your connection.');
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Search products when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setFilteredProducts(allProducts);
        return;
      }

      try {
        setLoading(true);
        const results = await searchProducts(searchQuery, 100);
        setFilteredProducts(results);
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to client-side search
        const filtered = allProducts.filter(product =>
          (product.Description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.SubCategory || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.ItemNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.Code || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, allProducts]);

  return (
    <div className="min-h-screen pt-20" style={{
      background: "#000000",
    }}>
      {/* Search Header - Pure Black with Gold Accents */}
      <section style={{
        background: "#000000",
        padding: "60px 20px",
        borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
        width: "100%",
      }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontFamily: "var(--font-cursive)",
              fontWeight: "600",
              background: "linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "24px",
            }}>
              Search <span style={{ color: "#D4AF37" }}>Collection</span>
            </h1>
            <p style={{
              color: "#a0a0a0",
              fontSize: "18px",
              marginBottom: "40px",
            }}>
              Find your perfect piece from our extensive collection
            </p>

            {/* Search Bar - Gold Highlighted */}
            <div style={{ position: "relative" }}>
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6" style={{ color: "#D4AF37", zIndex: 10 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for jewelry..."
                style={{
                  width: "100%",
                  padding: "18px 50px 18px 56px",
                  background: "rgba(26, 26, 26, 0.8)",
                  border: "2px solid rgba(212, 175, 55, 0.3)",
                  borderRadius: "12px",
                  fontSize: "16px",
                  color: "#f5f5f5",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(212, 175, 55, 0.1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#D4AF37";
                  e.target.style.boxShadow = "0 0 0 3px rgba(212, 175, 55, 0.1), 0 0 30px rgba(212, 175, 55, 0.4)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(212, 175, 55, 0.3)";
                  e.target.style.boxShadow = "0 4px 20px rgba(212, 175, 55, 0.1)";
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(212, 175, 55, 0.1)",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    borderRadius: "8px",
                    padding: "8px",
                    cursor: "pointer",
                    color: "#D4AF37",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(212, 175, 55, 0.2)";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <div className="container mx-auto px-4 py-12" style={{ maxWidth: "1400px" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
          style={{
            padding: "16px",
            background: "#000000",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          <p style={{
            color: "#a0a0a0",
            fontSize: "16px",
            margin: 0,
          }}>
            {searchQuery ? (
              <>
                Found <span style={{
                  color: "#D4AF37",
                  fontWeight: "700",
                  fontSize: "20px",
                }}>{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'result' : 'results'} for "<span style={{ color: "#f5f5f5", fontWeight: "600" }}>{searchQuery}</span>"
              </>
            ) : (
              <>
                Showing all <span style={{
                  color: "#D4AF37",
                  fontWeight: "700",
                  fontSize: "20px",
                }}>{allProducts.length}</span> products
              </>
            )}
          </p>
        </motion.div>

        {loading ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#D4AF37",
          }}>
            <Loader2 style={{
              width: "40px",
              height: "40px",
              margin: "0 auto 16px",
              animation: "spin 1s linear infinite",
            }} />
            <p style={{ color: "#a0a0a0" }}>Searching products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "16px",
          }}
          className="product-grid-responsive"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.LotNo || product.ItemNo}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onToggleWishlist={onToggleWishlist}
                isInWishlist={isInWishlist(product.LotNo || product.ItemNo)}
              />
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
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              border: "2px solid rgba(212, 175, 55, 0.3)",
            }}>
              <Search className="w-12 h-12" style={{ color: "#D4AF37" }} />
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
              No results found
            </h3>
            <p style={{
              color: "#a0a0a0",
              fontSize: "16px",
              marginBottom: "32px",
            }}>
              We couldn't find any products matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              style={{
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
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(212, 175, 55, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
