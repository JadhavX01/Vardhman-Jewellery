import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, ChevronDown, ChevronUp, Download, Loader } from "lucide-react";
import { toast } from "sonner";
import styles from "./AdminOrderDashboard.module.css";

const AdminOrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchType, setSearchType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    revenue: 0,
    avgOrder: 0
  });

  useEffect(() => {
    checkAuthAndFetchOrders();
  }, []);

  const checkAuthAndFetchOrders = async () => {
    try {
      setLoading(true);
      
      const vardhaman_user = localStorage.getItem('vardhaman_user');
      
      if (!vardhaman_user) {
        setError('❌ Please login as admin');
        toast.error('Please login as admin');
        setLoading(false);
        return;
      }

      let user = null;
      try {
        user = JSON.parse(vardhaman_user);
      } catch (e) {
        setError('❌ Invalid session');
        setLoading(false);
        return;
      }

      const role = user?.role;
      const token = user?.token;

      if (role !== 'admin' && role !== 'staff') {
        setError(`❌ Access Denied`);
        setLoading(false);
        return;
      }

      if (!token) {
        setError('❌ Session expired');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/orders/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success && data.data) {
        const latest10 = data.data
          .sort((a, b) => new Date(b.TDate) - new Date(a.TDate))
          .slice(0, 10);
        
        setOrders(latest10);
        setFilteredOrders(latest10);
        
        // Calculate stats
        const total = latest10.length;
        const revenue = latest10.reduce((sum, o) => sum + parseFloat(o.OnAmt || 0), 0);
        setStats({
          total,
          revenue,
          avgOrder: total > 0 ? revenue / total : 0
        });
        setError(null);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderNo) => {
    try {
      const vardhaman_user = localStorage.getItem('vardhaman_user');
      const user = JSON.parse(vardhaman_user);
      const token = user?.token;

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
      }
    } catch (err) {
      toast.error('Error loading order details');
    }
  };

  useEffect(() => {
    let filtered = orders;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order => {
        const custIdMatch = order.Cust_Id?.toLowerCase().includes(term);
        const orderNoMatch = order.CustInNo?.toLowerCase().includes(term);
        const dateMatch = new Date(order.TDate).toLocaleDateString('en-IN').includes(term);
        
        return custIdMatch || orderNoMatch || dateMatch;
      });
    }

    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>🔐</div>
          <h2 className={styles.errorTitle}>{error}</h2>
          <p className={styles.errorText}>
            Please make sure you're logged in as Admin/Staff
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Loading Orders...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerInfo}>
            <h1 className={styles.headerTitle}>📦 Orders</h1>
            <p className={styles.headerSubtitle}>
              Latest 10 Orders • Real-time Tracking
            </p>
          </div>
          <button onClick={checkAuthAndFetchOrders} className={styles.refreshBtn}>
            🔄 Refresh
          </button>
        </div>

        {/* STATS */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Orders</p>
            <p className={styles.statValue}>{stats.total}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Revenue</p>
            <p className={styles.statValue}>{formatCurrency(stats.revenue)}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Avg Order Value</p>
            <p className={styles.statValue}>{formatCurrency(stats.avgOrder)}</p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className={styles.searchContainer}>
        <div className={styles.searchControls}>
          <div className={styles.filterTypeWrapper}>
            <label className={styles.searchLabel}>🔍 Filter Type</label>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSearchTerm('');
              }}
              className={styles.filterSelect}
            >
              <option value="all">All Orders</option>
              <option value="custId">By Customer ID</option>
              <option value="orderNo">By Order Number</option>
              <option value="date">By Date</option>
            </select>
          </div>

          <div className={styles.searchInputWrapper}>
            <label className={styles.searchLabel}>Search</label>
            <input
              type={searchType === 'date' ? 'date' : 'text'}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className={styles.clearBtn}>
              Clear ✕
            </button>
          )}
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className={styles.tableContainer}>
        <div className={styles.scrollHint}>← Swipe to see more →</div>
        <div className={styles.tableWrapper}>
          {/* Table Header */}
          <div className={styles.tableHeader}>
            <div className={styles.colOrder}>📋 Order</div>
            <div className={styles.colCustomer}>🆔 Customer</div>
            <div className={styles.colDate}>📅 Date</div>
            <div className={styles.colWeight}>⚖️ Weight</div>
            <div className={styles.colAmount}>💰 Amount</div>
            <div className={styles.colStatus}>📊 Status</div>
          </div>

          {/* Table Body */}
          <div className={styles.tableBody}>
            {filteredOrders.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📭</div>
                <p className={styles.emptyTitle}>No orders found</p>
                <p className={styles.emptyText}>Try adjusting your search filters</p>
              </div>
            ) : (
              filteredOrders.map((order, idx) => (
                <div key={order.CustInNo} className={styles.orderWrapper}>
                  {/* Order Row */}
                  <div
                    className={`${styles.orderRow} ${expandedOrder === order.CustInNo ? styles.orderRowExpanded : ''} ${idx % 2 === 0 ? styles.orderRowEven : styles.orderRowOdd}`}
                    onClick={() => fetchOrderDetails(order.CustInNo)}
                  >
                    <div className={styles.colOrder}>
                      <span className={styles.orderNumber}>{order.CustInNo}</span>
                    </div>
                    <div className={styles.colCustomer}>
                      <span className={styles.customerId}>{order.Cust_Id}</span>
                    </div>
                    <div className={styles.colDate}>
                      <span className={styles.dateText}>{formatDate(order.TDate)}</span>
                    </div>
                    <div className={styles.colWeight}>
                      <span className={styles.weightText}>{parseFloat(order.TotWt).toFixed(2)}g</span>
                    </div>
                    <div className={styles.colAmount}>
                      <span className={styles.amountText}>{formatCurrency(order.OnAmt)}</span>
                    </div>
                    <div className={styles.colStatus}>
                      <span className={styles.statusBadge}>✅ Completed</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order.CustInNo && orderDetails[order.CustInNo] && (
                    <div className={styles.expandedDetails}>
                      <div className={styles.detailsHeader}>
                        <strong>📦 Order Items ({orderDetails[order.CustInNo].length})</strong>
                      </div>
                      <div className={styles.itemsList}>
                        {orderDetails[order.CustInNo].map((item, idx) => (
                          <div key={idx} className={styles.orderItem}>
                            <div className={styles.itemDescription}>
                              <strong>{item.Description}</strong>
                            </div>
                            <div className={styles.itemQty}>Qty: {item.Qty}</div>
                            <div className={styles.itemWeight}>Wt: {parseFloat(item.GWt).toFixed(2)}g</div>
                            <div className={styles.itemAmount}>
                              {formatCurrency(item.OAmt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className={styles.footer}>
        ✅ Showing <strong>{filteredOrders.length}</strong> order{filteredOrders.length !== 1 ? 's' : ''} 
        {searchTerm && ` • Filtered`}
      </div>
    </div>
  );
};

export default AdminOrderDashboard;
