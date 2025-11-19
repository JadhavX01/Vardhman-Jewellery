import React, { useState, useEffect } from "react";
import { X, Heart, ShoppingCart, Scale, Award, Package, Sparkles, ChevronLeft, ChevronRight, FileText, MessageCircle } from "lucide-react";
import API from "../../utils/api";
import { FaWhatsapp } from "react-icons/fa";


// Import local fallback images
import officeWear from "../../images/imgi_61_office-wear.jpg";
import modernWear from "../../images/imgi_62_modern-wear.jpg";
import marathiBride from "../../images/imgi_168_marathi-bride.jpg";

const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [termsAndCondition, setTermsAndCondition] = useState("");
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // ✅ WhatsApp configuration
  const ADMIN_WHATSAPP = "7743901468"; // Replace with your admin WhatsApp number (with country code, no +)

  // Fetch Terms & Conditions when modal opens
  useEffect(() => {
    if (product?.ItemNo && isOpen) {
      fetchTerms();
    }
  }, [product?.ItemNo, isOpen]);

  const fetchTerms = async () => {
    if (!product?.ItemNo) return;
    
    setLoadingTerms(true);
    try {
      const response = await API.get(`/stock/terms/${product.ItemNo}`);
      if (response.data.success) {
        setTermsAndCondition(response.data.data.TermsAndCondition || "");
      }
    } catch (error) {
      console.error("Fetch terms error:", error);
      setTermsAndCondition("");
    } finally {
      setLoadingTerms(false);
    }
  };

  // ✅ WhatsApp handler
  const handleWhatsApp = () => {
    const productName = product?.Description || "Product";
    const productCode = product?.ItemNo || "";
    const productPrice = product?.OfferPrice || product?.DisplayPrice || product?.OAmt || 0;
    
    const message = `Hi, I'm interested in:\n\n*${productName}*\nCode: ${productCode}\nPrice: ₹${productPrice.toLocaleString('en-IN')}\n\nCan you provide more details?`;
    
    const whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  if (!product || !isOpen) return null;

  // Get all images with local fallbacks
  const getImages = () => {
    if (!product.images || product.images.length === 0) {
      return [modernWear];
    }

    const images = product.images.map((img) => {
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
      return modernWear;
    });

    return images.length > 0 ? images : [modernWear];
  };

  const images = getImages();

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Backdrop with fade-in animation */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          zIndex: 50,
          cursor: 'pointer',
          animation: 'fadeIn 0.5s ease both',
        }}
        onClick={onClose}
      />

      {/* Modal - Centered with fade-in animation */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 51,
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '1000px',
            boxShadow: '0 20px 60px rgba(212, 175, 55, 0.3)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'fadeIn 0.6s ease both',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar with WhatsApp, Wishlist & Close */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 100,
            display: 'flex',
            gap: '12px',
          }}>
            {/* ✅ WhatsApp Button */}
         {/* WhatsApp Button */}
<button
  onClick={handleWhatsApp}
  style={{
    padding: '10px',
    border: '2px solid #25D366',
    borderRadius: '50%',
    background: 'rgba(37, 211, 102, 0.1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
  }}
  className="whatsapp-btn"
  title="Message on WhatsApp"
>
  <FaWhatsapp size={18} color="#25D366" />
</button>


            {/* Wishlist Button */}
            {onToggleWishlist && (
              <button
                onClick={() => onToggleWishlist(product)}
                style={{
                  padding: '10px',
                  border: '2px solid #D4AF37',
                  borderRadius: '50%',
                  background: isInWishlist 
                    ? 'linear-gradient(135deg, #D4AF37 0%, #c19820 100%)'
                    : 'rgba(0, 0, 0, 0.8)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  boxShadow: isInWishlist 
                    ? '0 4px 12px rgba(212, 175, 55, 0.4)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart
                  size={18}
                  style={{
                    color: isInWishlist ? '#0a0a0a' : '#D4AF37',
                    fill: isInWishlist ? '#0a0a0a' : 'none',
                  }}
                />
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                padding: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '2px solid #D4AF37',
                borderRadius: '50%',
                cursor: 'pointer',
                color: '#D4AF37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              }}
              className="close-btn"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content - Responsive Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr',
              gap: '24px',
              padding: '24px',
              paddingTop: '60px',
            }}
          >
            {/* LEFT: Image Gallery */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Main Image */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#1a1a1a',
                  border: '2px solid rgba(212, 175, 55, 0.3)',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={images[selectedImage]}
                  alt={product.Description}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = modernWear;
                  }}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#D4AF37',
                        border: '1px solid rgba(212, 175, 55, 0.5)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                      }}
                      className="nav-arrow"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      onClick={nextImage}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#D4AF37',
                        border: '1px solid rgba(212, 175, 55, 0.5)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                      }}
                      className="nav-arrow"
                    >
                      <ChevronRight size={18} />
                    </button>

                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '6px 12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: '#D4AF37',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '20px',
                        border: '1px solid rgba(212, 175, 55, 0.5)',
                      }}
                    >
                      {selectedImage + 1}/{images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: selectedImage === idx 
                          ? '3px solid #D4AF37' 
                          : '2px solid rgba(212, 175, 55, 0.3)',
                        cursor: 'pointer',
                        padding: 0,
                        backgroundColor: '#1a1a1a',
                        transition: 'all 0.3s',
                      }}
                    >
                      <img 
                        src={img} 
                        alt="" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Product Title */}
              <div>
                <h2 style={{ 
                  fontSize: '26px', 
                  fontWeight: 'bold', 
                  color: '#f5f5f5', 
                  marginBottom: '6px',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                }}>
                  {product.Description}
                </h2>
                {product.ItemNo && (
                  <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                    Code: <code style={{ color: '#D4AF37' }}>{product.ItemNo}</code>
                  </p>
                )}
              </div>

              {/* Price Section */}
              <div
                style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '2px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                {(() => {
                  const originalPrice = product.DisplayPrice || product.OAmt || 0;
                  const offerPrice = product.OfferPrice || 0;
                  const hasDiscount = offerPrice > 0 && offerPrice < originalPrice;
                  const discountPercent = hasDiscount 
                    ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100) 
                    : 0;
                  const savings = hasDiscount ? originalPrice - offerPrice : 0;

                  return hasDiscount ? (
                    <>
                      <p style={{ 
                        fontSize: '16px', 
                        color: '#999', 
                        textDecoration: 'line-through', 
                        margin: '0 0 6px 0' 
                      }}>
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </p>
                      <p style={{ 
                        fontSize: '32px', 
                        fontWeight: 'bold', 
                        color: '#D4AF37', 
                        margin: '0 0 10px 0',
                      }}>
                        ₹{offerPrice.toLocaleString('en-IN')}
                      </p>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#000',
                          background: 'linear-gradient(135deg, #D4AF37, #c19820)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                        }}>
                          {discountPercent}% OFF
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#22C55E' }}>
                          You save ₹{savings.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#D4AF37', margin: 0 }}>
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </p>
                  );
                })()}
              </div>

              {/* Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {product.GWt && (
                  <div style={{ 
                    background: 'rgba(212, 175, 55, 0.1)', 
                    border: '1px solid rgba(212, 175, 55, 0.3)', 
                    borderRadius: '10px', 
                    padding: '12px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Scale size={16} color="#D4AF37" />
                      <p style={{ fontSize: '11px', color: '#999', margin: 0, fontWeight: 'bold' }}>Weight</p>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#f5f5f5', margin: 0 }}>
                      {product.GWt.toFixed(2)} gm
                    </p>
                  </div>
                )}

                {product.GorS && (
                  <div style={{ 
                    background: 'rgba(212, 175, 55, 0.1)', 
                    border: '1px solid rgba(212, 175, 55, 0.3)', 
                    borderRadius: '10px', 
                    padding: '12px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Sparkles size={16} color="#D4AF37" />
                      <p style={{ fontSize: '11px', color: '#999', margin: 0, fontWeight: 'bold' }}>Metal</p>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#f5f5f5', margin: 0 }}>
                      {product.GorS === 'G' ? '🪙 Gold' : '⚪ Silver'}
                    </p>
                  </div>
                )}

                {product.Tunch && (
                  <div style={{ 
                    background: 'rgba(212, 175, 55, 0.1)', 
                    border: '1px solid rgba(212, 175, 55, 0.3)', 
                    borderRadius: '10px', 
                    padding: '12px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Award size={16} color="#D4AF37" />
                      <p style={{ fontSize: '11px', color: '#999', margin: 0, fontWeight: 'bold' }}>Purity</p>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#f5f5f5', margin: 0 }}>
                      {product.Tunch}
                    </p>
                  </div>
                )}

                {product.SubCategory && (
                  <div style={{ 
                    background: 'rgba(212, 175, 55, 0.1)', 
                    border: '1px solid rgba(212, 175, 55, 0.3)', 
                    borderRadius: '10px', 
                    padding: '12px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Package size={16} color="#D4AF37" />
                      <p style={{ fontSize: '11px', color: '#999', margin: 0, fontWeight: 'bold' }}>Category</p>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#f5f5f5', margin: 0 }}>
                      {product.SubCategory}
                    </p>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #D4AF37, #c19820)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s',
                  marginTop: '8px',
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                }}
                className="add-cart-btn"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              {/* Terms and Conditions Section */}
              {termsAndCondition && (
                <div style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginTop: '8px',
                }}>
                  <button
                    onClick={() => setShowTerms(!showTerms)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#D4AF37',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      padding: 0,
                      marginBottom: showTerms ? '10px' : 0,
                    }}
                  >
                    <FileText size={16} />
                    {showTerms ? 'Hide' : 'View'} Terms & Conditions
                  </button>
                  {showTerms && (
                    <div style={{
                      fontSize: '11px',
                      color: '#ccc',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.6',
                      maxHeight: '150px',
                      overflowY: 'auto',
                      padding: '8px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '6px',
                    }}>
                      {termsAndCondition}
                    </div>
                  )}
                </div>
              )}

              {/* Trust Badges */}
              <div style={{ 
                background: 'rgba(212, 175, 55, 0.1)', 
                border: '1px solid rgba(212, 175, 55, 0.3)', 
                borderRadius: '10px', 
                padding: '12px', 
                fontSize: '12px' 
              }}>
                <p style={{ margin: '6px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#f5f5f5' }}>
                  <span style={{ color: '#22C55E', fontWeight: 'bold' }}>✓</span> 100% Certified
                </p>
                <p style={{ margin: '6px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#f5f5f5' }}>
                  <span style={{ color: '#22C55E', fontWeight: 'bold' }}>✓</span> 7 Days Returns
                </p>
                <p style={{ margin: '6px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#f5f5f5' }}>
                  <span style={{ color: '#22C55E', fontWeight: 'bold' }}>✓</span> Free Shipping ₹50k+
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .close-btn:hover {
          transform: scale(1.1) rotate(90deg);
          background-color: rgba(212, 175, 55, 0.2) !important;
        }

        .whatsapp-btn:hover {
          transform: scale(1.1);
          background-color: rgba(37, 211, 102, 0.2) !important;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.5) !important;
        }

        .nav-arrow:hover {
          background-color: rgba(212, 175, 55, 0.3) !important;
          transform: translateY(-50%) scale(1.1);
        }

        .add-cart-btn:hover {
          background: linear-gradient(135deg, #EFE1C6, #D4AF37) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4) !important;
        }

        @media (max-width: 768px) {
          .product-image-container {
            max-height: 400px;
          }
        }
      `}</style>
    </>
  );
};

export default ProductDetailModal;
