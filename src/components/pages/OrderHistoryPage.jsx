import React, { useState, useEffect } from "react";
import { 
  Package, 
  ChevronDown, 
  Calendar, 
  DollarSign, 
  Weight,
  MapPin,
  Receipt,
  ShoppingBag
} from "lucide-react";
import { toast } from "sonner";
import "./OrderHistoryPage.css";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all customer orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const custId = localStorage.getItem('custId');

      if (!token || !custId) {
        toast.error('Please login to view orders');
        return;
      }

      const res = await fetch(`http://localhost:5000/api/orders/customer/${custId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success && data.data) {
        setOrders(data.data);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch order details when expanded
  const fetchOrderDetails = async (orderNo) => {
    try {
      const token = localStorage.getItem('token');

      if (orderDetails[orderNo]) {
        setExpandedOrder(expandedOrder === orderNo ? null : orderNo);
        return;
      }

      const res = await fetch(`http://localhost:5000/api/orders/${orderNo}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        setOrderDetails((prev) => ({
          ...prev,
          [orderNo]: data.data.items
        }));
        setExpandedOrder(expandedOrder === orderNo ? null : orderNo);
      } else {
        toast.error('Failed to load order details');
      }
    } catch (err) {
      console.error('Fetch details error:', err);
      toast.error('Error loading order details');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="order-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      {/* Hero Header */}
      <div className="order-hero">
        <div className="order-hero-content">
          <Package size={48} className="hero-icon" />
          <h1 className="order-hero-title">My Orders</h1>
          <p className="order-hero-subtitle">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </p>
        </div>
      </div>

      <div className="order-container">
        {orders.length === 0 ? (
          // Empty State
          <div className="order-empty">
            <ShoppingBag size={80} className="empty-icon" />
            <h2 className="empty-title">No Orders Yet</h2>
            <p className="empty-text">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <a href="/collections" className="empty-btn">
              <ShoppingBag size={18} />
              <span>Start Shopping</span>
            </a>
          </div>
        ) : (
          // Orders List
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.CustInNo} className="order-card">
                {/* Order Header */}
                <div
                  className="order-header"
                  onClick={() => fetchOrderDetails(order.CustInNo)}
                >
                  <div className="order-info-grid">
                    <div className="order-info-item">
                      <Receipt size={18} className="info-icon" />
                      <div>
                        <p className="info-label">Order Number</p>
                        <p className="info-value order-number">{order.CustInNo}</p>
                      </div>
                    </div>

                    <div className="order-info-item">
                      <Calendar size={18} className="info-icon" />
                      <div>
                        <p className="info-label">Order Date</p>
                        <p className="info-value">{formatDate(order.TDate)}</p>
                      </div>
                    </div>

                    <div className="order-info-item">
                      <DollarSign size={18} className="info-icon" />
                      <div>
                        <p className="info-label">Total Amount</p>
                        <p className="info-value order-price">
                          ₹{parseFloat(order.OnAmt).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="order-expand-btn">
                      <ChevronDown
                        size={24}
                        className={expandedOrder === order.CustInNo ? 'rotated' : ''}
                      />
                    </div>
                  </div>
                </div>

                {/* Order Details (Expanded) */}
                {expandedOrder === order.CustInNo && orderDetails[order.CustInNo] && (
                  <div className="order-details">
                    {/* Order Summary Stats */}
                    <div className="order-stats-grid">
                      <div className="stat-card">
                        <Weight size={20} className="stat-icon" />
                        <div>
                          <p className="stat-label">Total Weight</p>
                          <p className="stat-value">{parseFloat(order.TotWt).toFixed(2)} g</p>
                        </div>
                      </div>

                      <div className="stat-card">
                        <Receipt size={20} className="stat-icon" />
                        <div>
                          <p className="stat-label">CGST</p>
                          <p className="stat-value">
                            ₹{parseFloat(order.CGSTAmt || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="stat-card">
                        <Receipt size={20} className="stat-icon" />
                        <div>
                          <p className="stat-label">SGST</p>
                          <p className="stat-value">
                            ₹{parseFloat(order.SGSTAmt || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="stat-card">
                        <MapPin size={20} className="stat-icon" />
                        <div>
                          <p className="stat-label">Delivery</p>
                          <p className="stat-value stat-address">
                            {order.Add2 ? `${order.Add2.split('  ')[0]}` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="order-items-section">
                      <h3 className="items-title">
                        Order Items ({orderDetails[order.CustInNo].length})
                      </h3>

                      <div className="order-items-list">
                        {orderDetails[order.CustInNo].map((item, idx) => (
                          <div key={idx} className="order-item-card">
                            <div className="item-details">
                              <h4 className="item-name">{item.Description}</h4>
                              <div className="item-meta">
                                <span className="item-meta-badge">Item: {item.ItemNo}</span>
                                <span className="item-meta-badge">Qty: {item.Qty}</span>
                                <span className="item-meta-badge">
                                  {parseFloat(item.GWt).toFixed(2)}g
                                </span>
                              </div>
                            </div>

                            <div className="item-price">
                              <p className="item-amount">
                                ₹{parseFloat(item.OAmt).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
