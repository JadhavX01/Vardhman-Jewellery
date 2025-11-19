import React, { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

// Import local fallback images
import rivaahJwgs from "../../images/imgi_177_rivaah-jwgs.jpg";
import rivaahGlass from "../../images/imgi_176_rivaah-glass-kundan.jpg";

const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, fetchCartItems }) => {
  const [loadingCartId, setLoadingCartId] = useState(null);

  // Updated: Use OfferPrice not DiscountPrice
  const calculateTotals = () => {
    let subtotal = 0;
    let totalSavings = 0;

    items.forEach((item) => {
      const originalPrice = item.DisplayPrice || item.OAmt || 0;
      const offerPrice = item.OfferPrice || 0;
      const qty = item.Quantity || item.quantity || 1;

      const hasDiscount = offerPrice > 0 && offerPrice < originalPrice;
      const effectivePrice = hasDiscount ? offerPrice : originalPrice;

      subtotal += effectivePrice * qty;

      if (hasDiscount) {
        totalSavings += (originalPrice - offerPrice) * qty;
      }
    });

    return { subtotal, totalSavings };
  };

  const { subtotal, totalSavings } = calculateTotals();

  // Get image URL with local fallback
  const getImageUrl = (item) => {
    if (item.images && item.images.length > 0) {
      const filePath = item.images[0].FilePath;
      return filePath.startsWith('http') 
        ? filePath 
        : `http://localhost:5000${filePath}`;
    }
    return rivaahJwgs;
  };

  const handleRemove = async (cartId) => {
    setLoadingCartId(cartId);
    try {
      await onRemoveItem(cartId);  // Deletes from backend and updates state
      if (fetchCartItems) {
        await fetchCartItems();    // Refetch to ensure sync with backend
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setLoadingCartId(null);
    }
  };
  
  

  
  const handleQuantityChange = (cartId, newQty) => {
    if (newQty <= 0) return;
    onUpdateQuantity(cartId, newQty);
  };

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 50,
            cursor: 'pointer',
            transition: 'opacity 0.3s ease'
          }}
          onClick={onClose}
        />
      )}

      {/* Cart Drawer */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100vh',
          width: '100%',
          maxWidth: '420px',
          background: '#000000',
          borderLeft: '2px solid rgba(212, 175, 55, 0.3)',
          zIndex: 51,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen ? '-10px 0 40px rgba(212, 175, 55, 0.2)' : 'none'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.95) 100%)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #c19820 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
              }}
            >
              <ShoppingBag size={22} color="#0a0a0a" />
            </div>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                letterSpacing: '0.5px'
              }}>
                Shopping Cart
              </h2>
              <p style={{
                fontSize: '13px',
                color: '#a0a0a0',
                margin: '4px 0 0 0',
                fontWeight: '500'
              }}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#D4AF37',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            background: '#000000'
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                padding: '40px 20px'
              }}
            >
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  border: '2px solid rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 8px 30px rgba(212, 175, 55, 0.15)'
                }}
              >
                <ShoppingBag size={48} color="#D4AF37" />
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '12px',
                letterSpacing: '0.5px'
              }}>
                Your cart is empty
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#a0a0a0',
                marginBottom: '32px',
                maxWidth: '280px'
              }}>
                Add some beautiful jewelry to get started
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map((item) => {
                const originalPrice = item.DisplayPrice || item.OAmt || 0;
                const offerPrice = item.OfferPrice || 0;
                const hasDiscount = offerPrice > 0 && offerPrice < originalPrice;
                const effectivePrice = hasDiscount ? offerPrice : originalPrice;
                const qty = item.Quantity || item.quantity || 1;

                return (
                  <div
                    key={item.CartId || item.ItemNo}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      background: '#000000',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#2d2d2d',
                        flexShrink: 0
                      }}
                    >
                      <img
                        src={getImageUrl(item)}
                        alt={item.Description}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.currentTarget.src = rivaahGlass;
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#f5f5f5',
                        margin: '0 0 6px 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        lineHeight: '1.4'
                      }}>
                        {item.Description}
                      </h4>
                      <p style={{
                        fontSize: '12px',
                        color: '#a0a0a0',
                        margin: '4px 0',
                        fontWeight: '500'
                      }}>
                        {item.SubCategory}
                      </p>

                      {/* Price with Offer */}
                      {hasDiscount ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                          <p style={{
                            fontSize: '12px',
                            color: '#666',
                            textDecoration: 'line-through',
                            margin: 0
                          }}>
                            ₹{originalPrice.toLocaleString('en-IN')}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <p style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              background: 'linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              margin: 0,
                              letterSpacing: '0.3px'
                            }}>
                              ₹{offerPrice.toLocaleString('en-IN')}
                            </p>
                            <span style={{
                              fontSize: '9px',
                              fontWeight: '700',
                              color: '#0a0a0a',
                              background: 'linear-gradient(135deg, #D4AF37 0%, #c19820 100%)',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}>
                              {Math.round(((originalPrice - offerPrice) / originalPrice) * 100)}% OFF
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          background: 'linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          margin: '8px 0 0 0',
                          letterSpacing: '0.3px'
                        }}>
                          ₹{originalPrice.toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between'
                      }}
                    >
                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemove(item.CartId)}
                        disabled={loadingCartId === item.CartId}
                        style={{
                          padding: '8px',
                          background: 'rgba(220, 38, 38, 0.1)',
                          border: '1px solid rgba(220, 38, 38, 0.3)',
                          borderRadius: '8px',
                          cursor: loadingCartId === item.CartId ? 'not-allowed' : 'pointer',
                          opacity: loadingCartId === item.CartId ? 0.5 : 1,
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (loadingCartId !== item.CartId) {
                            e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.5)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                        }}
                      >
                        <Trash2 size={16} color="#dc2626" />
                      </button>

                      {/* Quantity Control */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: '#000000',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}
                      >
                        <button
                          onClick={() => handleQuantityChange(item.CartId, (item.Quantity || item.quantity || 1) - 1)}
                          disabled={(item.Quantity || item.quantity || 1) <= 1}
                          style={{
                            padding: '6px 10px',
                            border: 'none',
                            background: 'transparent',
                            color: (item.Quantity || item.quantity || 1) <= 1 ? '#666' : '#D4AF37',
                            cursor: (item.Quantity || item.quantity || 1) <= 1 ? 'not-allowed' : 'pointer',
                            opacity: (item.Quantity || item.quantity || 1) <= 1 ? 0.5 : 1,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if ((item.Quantity || item.quantity || 1) > 1) {
                              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span
                          style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#D4AF37',
                            minWidth: '32px',
                            textAlign: 'center',
                            borderLeft: '1px solid rgba(212, 175, 55, 0.2)',
                            borderRight: '1px solid rgba(212, 175, 55, 0.2)'
                          }}
                        >
                          {item.Quantity || item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.CartId, (item.Quantity || item.quantity || 1) + 1)}
                          style={{
                            padding: '6px 10px',
                            border: 'none',
                            background: 'transparent',
                            color: '#D4AF37',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              borderTop: '1px solid rgba(212, 175, 55, 0.2)',
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.95) 100%)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  color: '#a0a0a0',
                  fontWeight: '500'
                }}
              >
                <span>Subtotal</span>
                <span style={{ color: '#f5f5f5', fontWeight: '600' }}>
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {totalSavings > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    color: '#2e7d32',
                    fontWeight: '600'
                  }}
                >
                  <span>You saved</span>
                  <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  color: '#a0a0a0',
                  fontWeight: '500'
                }}
              >
                <span>Shipping</span>
                <span style={{ color: '#D4AF37', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Free
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: '700',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(212, 175, 55, 0.2)'
                }}
              >
                <span style={{ color: '#f5f5f5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total
                </span>
                <span
                  style={{
                    fontSize: '22px',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '0.5px'
                  }}
                >
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <button
              style={{
                width: '100%',
                padding: '16px 24px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #c19820 100%)',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '15px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #E5C158 0%, #D4AF37 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37 0%, #c19820 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
              }}
              onClick={() => window.location.href = '/checkout'}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
      <style>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(26, 26, 26, 0.5);
        }
        div::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #D4AF37 0%, #c19820 100%);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #E5C158 0%, #D4AF37 100%);
        }
      `}</style>
    </>
  );
};

export default Cart;
