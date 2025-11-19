import React, { useState, useEffect } from "react";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import "./WishlistPage.css";

const WishlistPage = ({
  wishlistItems = [],
  onAddToCart,
  onToggleWishlist,
  onQuickView,
}) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(wishlistItems);

  useEffect(() => {
    setItems(wishlistItems);
  }, [wishlistItems]);

  const getImageUrl = (item) => {
    if (item.images && item.images.length > 0) {
      const filePath = item.images[0].FilePath;
      return filePath.startsWith("http")
        ? filePath
        : `http://localhost:5000${filePath}`;
    }
    return "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80";
  };

  const handleRemoveFromWishlist = (item) => {
    onToggleWishlist(item);
    setItems((prev) => prev.filter((i) => i.LotNo !== item.LotNo));
    toast.error(`${item.Description} removed from wishlist`);
  };

  const handleAddToCart = (item) => {
    onAddToCart(item);
    toast.success(`${item.Description} added to cart`);
  };

  return (
    <div className="wishlist-page">
      {/* Hero Header */}
      <div className="wishlist-hero">
        <div className="wishlist-hero-content">
          <div className="wishlist-header-icon">
            <Heart size={48} />
          </div>
          <h1 className="wishlist-title">My Wishlist</h1>
          <p className="wishlist-subtitle">
            {items.length} {items.length === 1 ? "treasure" : "treasures"} saved for you
          </p>
        </div>
      </div>

      <div className="wishlist-container">
        {items.length === 0 ? (
          // Empty State
          <div className="wishlist-empty">
            <Heart size={80} className="empty-icon" />
            <h2 className="empty-title">Your wishlist is empty</h2>
            <p className="empty-text">
              Start adding your favorite jewelry pieces to your wishlist!
            </p>
            <a href="/collections" className="btn-shop">
              <Sparkles size={18} />
              <span>Explore Collections</span>
            </a>
          </div>
        ) : (
          // Wishlist Grid
          <div className="wishlist-grid">
            {items.map((item) => (
              <div key={item.ItemNo || item.LotNo} className="wishlist-card">
                {/* Image Section */}
                <div className="wishlist-card-image">
                  <img
                    src={getImageUrl(item)}
                    alt={item.Description}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80";
                    }}
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item)}
                    className="wishlist-remove-btn"
                    title="Remove from wishlist"
                  >
                    <Heart size={18} fill="#D4AF37" />
                  </button>

                  {/* Quick View Overlay */}
                  <div className="wishlist-overlay">
                    <button
                      onClick={() => onQuickView(item)}
                      className="overlay-btn"
                    >
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Info Section */}
                <div className="wishlist-card-info">
                  <div className="wishlist-category">
                    {item.SubCategory || 'Jewelry'}
                  </div>

                  <h3 className="wishlist-product-title">
                    {item.Description || "Jewelry Item"}
                  </h3>

                  {/* Metal & Weight */}
                  <div className="wishlist-specs">
                    {item.GorS && (
                      <span className="spec-badge">
                        {item.GorS === 'G' ? '🪙 Gold' : '⚪ Silver'}
                      </span>
                    )}
                    {item.GWt && (
                      <span className="spec-badge">{item.GWt.toFixed(2)}g</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="wishlist-price-section">
                    {item.DiscountPrice && item.DiscountPrice < (item.DisplayPrice || item.OAmt) ? (
                      <>
                        <span className="price-old">
                          ₹{(item.DisplayPrice || item.OAmt || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="price-new">
                          ₹{item.DiscountPrice.toLocaleString('en-IN')}
                        </span>
                      </>
                    ) : (
                      <span className="price-new">
                        ₹{(item.DisplayPrice || item.OAmt || 0).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="wishlist-cart-btn"
                  >
                    <ShoppingBag size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
