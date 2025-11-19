import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronRight, CheckCircle, CreditCard, Wallet } from "lucide-react";
import { toast } from "sonner";
import useRazorpay from "../../hooks/useRazorpay";
import "./CheckoutPage.css";

const CheckoutPage = ({ cartItems, onOrderComplete }) => {
  const navigate = useNavigate();
  const { initiatePayment, loading: paymentLoading } = useRazorpay();
  
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNo, setOrderNo] = useState("");

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    phone: "",
    pinCode: "",
    paymentMethod: "online",
  });

  // ✅ Debug cart items on load
  useEffect(() => {
    console.log('🛒 Cart Items in Checkout:', cartItems);
    cartItems.forEach(item => {
      console.log(`📦 ${item.Description}:`, {
        DisplayPrice: item.DisplayPrice,
        OfferPrice: item.OfferPrice,
        OAmt: item.OAmt,
        Using: item.OfferPrice || item.DisplayPrice || item.OAmt
      });
    });
  }, [cartItems]);

  // ✅ Calculate totals with GST (1.5% + 1.5%) and OfferPrice support
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      // ✅ Priority: OfferPrice > DisplayPrice > OAmt
      const price = item.OfferPrice || item.DisplayPrice || item.OAmt || 0;
      const qty = item.Quantity || 1;
      return sum + (parseFloat(price) * qty);
    }, 0);

    const cgst = subtotal * 0.015; // 1.5% CGST
    const sgst = subtotal * 0.015; // 1.5% SGST
    const total = subtotal + cgst + sgst;

    return { subtotal, cgst, sgst, total };
  };

  const { subtotal, cgst, sgst, total } = calculateTotals();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.address.trim()) {
      toast.error('Please enter delivery address');
      return false;
    }
    if (!formData.city.trim()) {
      toast.error('Please enter city');
      return false;
    }
    if (!formData.state.trim()) {
      toast.error('Please enter state');
      return false;
    }
    if (!formData.pinCode.trim() || formData.pinCode.length !== 6) {
      toast.error('Please enter valid 6-digit PIN code');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length !== 10) {
      toast.error('Please enter valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const custId = localStorage.getItem('custId');
    const token = localStorage.getItem('token');

    if (!token || !custId || cartItems.length === 0) {
      toast.error('Please login and add items to cart');
      return;
    }

    if (formData.paymentMethod === 'online') {
      const deliveryDetails = {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        phone: formData.phone
      };

      initiatePayment(
        {
          amount: total,
          cartItems: cartItems,
          deliveryDetails: deliveryDetails
        },
        (paymentData) => {
          console.log('✅ Payment successful:', paymentData);
          localStorage.removeItem(`cart_${custId}`);
          onOrderComplete();
          setOrderNo(paymentData.orderNo);
          setOrderPlaced(true);
          toast.success(`Order ${paymentData.orderNo} placed successfully!`);
        },
        (error) => {
          console.error('❌ Payment failed:', error);
          toast.error('Payment failed. Please try again.');
        }
      );
    } else {
      handleCODOrder();
    }
  };

  const handleCODOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const custId = localStorage.getItem('custId');

      const res = await fetch('http://localhost:5000/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          custId,
          cartItems,
          deliveryDetails: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            phone: formData.phone,
            pinCode: formData.pinCode
          },
          paymentMethod: 'cod'
        })
      });

      const data = await res.json();

      if (data.success) {
        console.log('✅ Order placed:', data.orderNo);
        localStorage.removeItem(`cart_${custId}`);
        onOrderComplete();
        setOrderNo(data.orderNo);
        setOrderPlaced(true);
        toast.success(`Order ${data.orderNo} placed successfully!`);
      } else {
        console.error('❌ Order failed:', data.message);
        toast.error(data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('❌ Order error:', err);
      toast.error('Failed to place order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="success-screen">
        <div className="success-card">
          <div className="success-icon-wrapper">
            <CheckCircle size={48} className="success-icon" />
          </div>
          <h2 className="success-title">Order Placed Successfully!</h2>
          <p className="success-subtitle">Your order has been confirmed</p>
          <div className="order-number-box">
            <p className="order-number-label">Order Number</p>
            <p className="order-number-value">{orderNo}</p>
          </div>
          <button onClick={() => navigate("/")} className="continue-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-left">
          <h2 className="section-title">Delivery Address</h2>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter full address" className="form-input" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter city" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="Enter state" className="form-input" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Pin Code</label>
              <input type="text" name="pinCode" value={formData.pinCode} onChange={handleInputChange} placeholder="6-digit PIN" maxLength="6" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10-digit phone" maxLength="10" className="form-input" />
            </div>
          </div>

          <div className="payment-section">
            <h3 className="section-subtitle">Payment Method</h3>
            <div className="payment-options">
              <div className={`payment-option ${formData.paymentMethod === 'online' ? 'selected' : ''}`} onClick={() => setFormData({ ...formData, paymentMethod: 'online' })}>
                <input type="radio" checked={formData.paymentMethod === 'online'} onChange={() => setFormData({ ...formData, paymentMethod: 'online' })} />
                <CreditCard size={24} className="payment-icon" />
                <div className="payment-details">
                  <h4>Online Payment</h4>
                  <p>UPI, Cards, Wallets (Razorpay)</p>
                </div>
              </div>

              <div className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`} onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}>
                <input type="radio" checked={formData.paymentMethod === 'cod'} onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })} />
                <Wallet size={24} className="payment-icon" />
                <div className="payment-details">
                  <h4>Cash on Delivery</h4>
                  <p>Pay when you receive</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-right">
          <div className="order-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-items">
              {cartItems.map((item, idx) => {
                // ✅ Use OfferPrice if available, otherwise DisplayPrice
                const itemPrice = item.OfferPrice || item.DisplayPrice || item.OAmt || 0;
                const quantity = item.Quantity || 1;
                
                return (
                  <div key={idx} className="summary-item">
                    <div className="item-info">
                      <p className="item-name">{item.Description}</p>
                      <p className="item-meta">
                        Qty: {quantity} × ₹{parseFloat(itemPrice).toLocaleString()}
                        {item.OfferPrice && item.OfferPrice < item.DisplayPrice && (
                          <span style={{ color: '#4ade80', marginLeft: '8px', fontSize: '11px' }}>
                            (Offer Price)
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="item-price">
                      ₹{(parseFloat(itemPrice) * quantity).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span className="total-label">Subtotal</span>
                <span className="total-value">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span className="total-label">CGST (1.5%)</span>
                <span className="total-value">₹{cgst.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span className="total-label">SGST (1.5%)</span>
                <span className="total-value">₹{sgst.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span className="total-label">Shipping</span>
                <span className="total-value free">FREE</span>
              </div>
              <div className="total-row grand-total">
                <span className="total-label">Total</span>
                <span className="total-value">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={handlePlaceOrder} disabled={loading || paymentLoading} className="place-order-btn">
              {loading || paymentLoading ? 'Processing...' : (
                <>
                  {formData.paymentMethod === 'online' ? '💳 Pay Now' : '📦 Place Order'}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
