import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import "./ProductCard.css";

// Import local fallback images
import ring01 from "../../images/ring01.jpg";
import hero1 from "../../images/hero1.jpg";

const ProductCard = ({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isInWishlist,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wishlistState, setWishlistState] = useState(false); // ✅ Local state

  // Get images
  const getImages = () => {
    if (product.images && product.images.length > 0) {
      return product.images.map((img) => {
        if (typeof img === 'object' && img.FilePath) {
          let filePath = img.FilePath;
          if (filePath.startsWith('/images/')) {
            return `http://localhost:5000${filePath}`;
          }
          return `http://localhost:5000/images/${filePath}`;
        }
        if (typeof img === 'string') {
          return img.startsWith('http') ? img : `http://localhost:5000/images/${img}`;
        }
        return ring01;
      });
    }
    return [hero1];
  };

  const images = getImages();
  const currentImage = images[currentImageIndex] || ring01;

  // Calculate prices and discount
  const originalPrice = product.DisplayPrice || product.OAmt || 0;
  const offerPrice = product.OfferPrice || 0; // Use OfferPrice instead of discountPrice
  const hasDiscount = offerPrice > 0 && offerPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
    : 0;

  // ✅ Check wishlist from prop
  const productId = product.LotNo || product.ItemNo;
  const inWishlist = typeof isInWishlist === 'function' 
    ? isInWishlist(productId) 
    : false;

  // ✅ Sync local state with prop changes
  useEffect(() => {
    setWishlistState(inWishlist);
  }, [inWishlist]);

  // Handle image click
  const handleImageClick = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  // ✅ Handle wishlist click with instant visual feedback
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setWishlistState(!wishlistState); // Instant UI update
    onToggleWishlist(product); // API call
    console.log('Wishlist toggled:', !wishlistState);
  };

  return (
    <div className="jewelry-card">
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="badge">{discountPercent}% OFF</div>
      )}

      {/* ✅ WISHLIST BUTTON - Using local state for instant feedback */}
      <button
        onClick={handleWishlistClick}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '32px',
          height: '32px',
          background: wishlistState 
            ? 'linear-gradient(135deg, #D4AF37, #c19820)' 
            : 'rgba(0, 0, 0, 0.8)',
          border: `2px solid ${wishlistState ? '#D4AF37' : 'rgba(212, 175, 55, 0.5)'}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 10,
          boxShadow: wishlistState 
            ? '0 4px 12px rgba(212, 175, 55, 0.5)' 
            : '0 2px 8px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(5px)',
        }}
        onMouseEnter={(e) => {
          if (!wishlistState) {
            e.currentTarget.style.transform = 'scale(1.15)';
            e.currentTarget.style.borderColor = '#D4AF37';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          if (!wishlistState) {
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
          }
        }}
      >
        <Heart 
          size={16} 
          fill={wishlistState ? "#000" : "none"} 
          stroke={wishlistState ? "#000" : "#D4AF37"}
          style={{ transition: 'all 0.3s ease' }}
        />
      </button>

      {/* Image Section */}
      <div className="tilt" onClick={handleImageClick}>
        <div className="img">
          <img 
            key={currentImageIndex}
            src={currentImage}
            alt={product.Description || 'Jewelry'}
            onError={(e) => {
              e.currentTarget.src = hero1;
            }}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="info">
        <div className="cat">{product.SubCategory || 'Jewelry Collection'}</div>
        <h2 className="title">{product.Description || "Jewelry Item"}</h2>

        <div className="feats">
          {product.GorS && (
            <span className="feat">
              {product.GorS === 'G' ? 'Gold' : 'Silver'}
            </span>
          )}
          {product.GWt && (
            <span className="feat">{product.GWt.toFixed(2)}g</span>
          )}
          {product.Tunch && (
            <span className="feat">{product.Tunch}</span>
          )}
        </div>

        <div className="bottom">
          <div className="price">
            {hasDiscount && (
              <span className="old">₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
            <span className="new">₹{(hasDiscount ? offerPrice : originalPrice).toLocaleString('en-IN')}</span>
          </div>
          <button 
            className="btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <span>Add to Cart</span>
            <ShoppingCart className="icon" size={18} />
          </button>
        </div>

        <div 
          className="view-link"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
        >
          View Full Details →
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
