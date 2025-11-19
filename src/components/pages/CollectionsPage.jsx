import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../shared/ProductCard";
import { Loader2, Filter } from "lucide-react";
import { getAllProducts } from "../../services/productService";
import "./CollectionsPage.css";

// Import bride images
import bengaliBride from "../../images/imgi_164_bengali-bride.jpg";
import gujaratiBride from "../../images/imgi_166_gujarati-bride.jpg";
import upBride from "../../images/imgi_173_up-bride.jpg";
import punjabiBride from "../../images/imgi_170_punjabi-bride.jpg";

const CollectionsPage = ({
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isInWishlist,
  productRefreshCounter,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetal, setSelectedMetal] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory !== "all") {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory, setSearchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const allProducts = await getAllProducts({ limit: 1000 });
        setProducts(allProducts);
      } catch (error) {
        setError("Failed to load products. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [productRefreshCounter]);

  const filteredProducts = products.filter((product) => {
    const metalMatch =
      selectedMetal === "all" ||
      product.GorS?.toUpperCase() === selectedMetal.toUpperCase();
    if (selectedCategory === "all") {
      return metalMatch;
    }
    const categoryLower = selectedCategory.toLowerCase();
    const subCategory = product.SubCategory?.toLowerCase() || "";
    const description = product.Description?.toLowerCase() || "";
    const itemNo = product.ItemNo?.toLowerCase() || "";
    const categoryMatch =
      subCategory.includes(categoryLower) ||
      description.includes(categoryLower) ||
      itemNo.includes(categoryLower) ||
      (categoryLower === "ring" && (subCategory.includes("ring") || description.includes("ring"))) ||
      (categoryLower === "rings" && (subCategory.includes("ring") || description.includes("ring"))) ||
      (categoryLower === "necklace" && (subCategory.includes("necklace") || description.includes("necklace"))) ||
      (categoryLower === "necklaces" && (subCategory.includes("necklace") || description.includes("necklace"))) ||
      (categoryLower === "earring" && (subCategory.includes("earring") || description.includes("earring"))) ||
      (categoryLower === "earrings" && (subCategory.includes("earring") || description.includes("earring"))) ||
      (categoryLower === "bracelet" && (subCategory.includes("bracelet") || description.includes("bracelet"))) ||
      (categoryLower === "bracelets" && (subCategory.includes("bracelet") || description.includes("bracelet"))) ||
      (categoryLower === "bangle" && (subCategory.includes("bangle") || description.includes("bangle"))) ||
      (categoryLower === "bangles" && (subCategory.includes("bangle") || description.includes("bangle"))) ||
      (categoryLower === "chain" && (subCategory.includes("chain") || description.includes("chain"))) ||
      (categoryLower === "chains" && (subCategory.includes("chain") || description.includes("chain")));
    return metalMatch && categoryMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.DisplayPrice || a.OAmt || 0;
    const priceB = b.DisplayPrice || b.OAmt || 0;
    if (sortBy === "price-low") return priceA - priceB;
    if (sortBy === "price-high") return priceB - priceA;
    if (sortBy === "name") return (a.Description || "").localeCompare(b.Description || "");
    return 0;
  });

  const metalTypes = [
    { value: "all", label: "All Metals", icon: "✨" },
    { value: "G", label: "Gold", icon: "🪙" },
    { value: "S", label: "Silver", icon: "⚪" },
  ];

  const categories = [
    { value: "all", label: "All" },
    { value: "ring", label: "Rings" },
    { value: "chain", label: "Chains" },
    { value: "bangle", label: "Bangles" },
    { value: "necklace", label: "Necklaces" },
    { value: "earring", label: "Earrings" },
    { value: "bracelet", label: "Bracelets" },
  ];

  return (
    <div className="collections-page">
      {/* Responsive 4-Image Grid Hero Section */}
      <section 
        className="collections-hero"
        data-aos="fade-in"
        data-aos-duration="800"
      >
        <div className="collections-hero-grid">
          {[bengaliBride, gujaratiBride, upBride, punjabiBride].map((img, idx) => (
            <div
              key={idx}
              className="collections-hero-image"
              style={{ backgroundImage: `url(${img})` }}
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
              data-aos-duration="1000"
            />
          ))}
        </div>
        <div className="collections-hero-overlay" />
        <div 
          className="collections-hero-content"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <h1 
            className="collections-hero-title"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            Our Collections
          </h1>
          <p 
            className="collections-hero-subtitle"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            Explore our complete range of exquisite jewelry pieces
          </p>
        </div>
      </section>

      <div className="container-fluid" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 16px' }}>
        {/* Mobile Filter Toggle */}
        <div 
          className="d-lg-none mb-4" 
          style={{ width: '100%' }}
          data-aos="fade-down"
        >
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <Filter size={18} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '32px', flexDirection: window.innerWidth < 1024 ? 'column' : 'row' }}>
          {/* Sidebar Filters */}
          <aside 
            style={{
              width: '280px',
              flexShrink: 0,
              background: '#000000',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '12px',
              padding: '24px',
              height: 'fit-content',
              position: 'sticky',
              top: '100px',
              display: window.innerWidth < 1024 ? (showFilters ? 'block' : 'none') : 'block',
            }}
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <h3 style={{
              fontSize: '20px',
              fontFamily: 'var(--font-cursive)',
              fontWeight: '600',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Filters
            </h3>
            
            {/* Metal Type */}
            <div 
              style={{ marginBottom: '28px' }}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <h6 style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#D4AF37',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}>
                Metal Type
              </h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {metalTypes.map((metal, idx) => (
                  <button
                    key={metal.value}
                    onClick={() => setSelectedMetal(metal.value)}
                    style={{
                      padding: '12px 16px',
                      background: selectedMetal === metal.value
                        ? 'linear-gradient(135deg, #D4AF37 0%, #c19820 100%)'
                        : '#000000',
                      color: selectedMetal === metal.value ? '#0a0a0a' : '#f5f5f5',
                      border: selectedMetal === metal.value
                        ? '1px solid #D4AF37'
                        : '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      fontSize: '14px',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                    data-aos="fade-right"
                    data-aos-delay={350 + (idx * 50)}
                  >
                    <span style={{ fontSize: '18px' }}>{metal.icon}</span>
                    {metal.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Category Filter */}
            <div 
              style={{ marginBottom: '28px' }}
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h6 style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#D4AF37',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}>
                Category
              </h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {categories.map((category, idx) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    style={{
                      padding: '12px 16px',
                      background: selectedCategory === category.value
                        ? 'linear-gradient(135deg, #D4AF37 0%, #c19820 100%)'
                        : '#000000',
                      color: selectedCategory === category.value ? '#0a0a0a' : '#f5f5f5',
                      border: selectedCategory === category.value
                        ? '1px solid #D4AF37'
                        : '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      fontSize: '14px',
                      textAlign: 'left',
                    }}
                    data-aos="fade-right"
                    data-aos-delay={450 + (idx * 40)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Sort */}
            <div 
              style={{ paddingTop: '20px', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <h6 style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#D4AF37',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}>
                Sort By
              </h6>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '10px',
                  background: '#000000',
                  color: '#f5f5f5',
                  cursor: 'pointer',
                }}
              >
                <option value="featured" style={{ background: '#000000' }}>Featured</option>
                <option value="price-low" style={{ background: '#000000' }}>Price: Low to High</option>
                <option value="price-high" style={{ background: '#000000' }}>Price: High to Low</option>
                <option value="name" style={{ background: '#000000' }}>Name: A to Z</option>
              </select>
            </div>
          </aside>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Results Header */}
            <div 
              style={{
                marginBottom: '24px',
                padding: '16px',
                background: '#000000',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '8px',
              }}
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <p style={{
                fontSize: '15px',
                color: '#a0a0a0',
                margin: 0,
              }}>
                Showing <span style={{
                  color: '#D4AF37',
                  fontWeight: '700',
                  fontSize: '18px',
                }}>{sortedProducts.length}</span> products
                {selectedCategory !== "all" && (
                  <span style={{ color: '#D4AF37', marginLeft: '8px' }}>
                    in {categories.find(c => c.value === selectedCategory)?.label || selectedCategory}
                  </span>
                )}
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div 
                style={{ textAlign: 'center', padding: '80px 16px' }}
                data-aos="fade-up"
              >
                <Loader2 size={48} style={{
                  color: '#D4AF37',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px',
                }} />
                <p style={{ color: '#a0a0a0', fontSize: '16px' }}>Loading products...</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div 
                style={{
                  textAlign: 'center',
                  padding: '80px 16px',
                  color: '#dc2626',
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  borderRadius: '12px',
                }}
                data-aos="fade-up"
              >
                <p style={{ fontSize: '16px', marginBottom: '16px' }}>{error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                  Retry
                </button>
              </div>
            )}

            {/* No Products */}
            {!loading && !error && sortedProducts.length === 0 && (
              <div 
                style={{
                  textAlign: 'center',
                  padding: '60px 16px',
                  color: '#a0a0a0',
                  background: '#000000',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '8px',
                }}
                data-aos="zoom-in"
              >
                <p style={{ fontSize: '16px', marginBottom: '16px' }}>No products found. Try adjusting your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedMetal("all");
                  }}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Product Grid */}
            {!loading && !error && sortedProducts.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '20px',
              }}>
                {sortedProducts.map((product, idx) => (
                  <div
                    key={product.LotNo || product.ItemNo}
                    data-aos="fade-up"
                    data-aos-delay={idx * 50}
                    data-aos-duration="800"
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={onAddToCart}
                      onQuickView={onQuickView}
                      onToggleWishlist={onToggleWishlist}
                      isInWishlist={isInWishlist(product.LotNo)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
