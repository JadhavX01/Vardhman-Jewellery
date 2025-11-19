import { useState } from "react";
import { Plus, Package, TrendingUp, AlertCircle } from "lucide-react";
import AddProductByItemNo from "./modals/AddProductByItemNo";

const InventorySection = ({ products, fetchProducts }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate stats
  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.Sold !== 'Y').length;
  const soldProducts = products.filter(p => p.Sold === 'Y').length;
  const totalValue = products.reduce((sum, p) => sum + (p.OAmt || 0), 0);

  // Get products by category
  const categories = [...new Set(products.map(p => p.Description).filter(Boolean))];
  const categoryStats = categories
    .map(cat => ({
      name: cat,
      count: products.filter(p => p.Description === cat).length,
      available: products.filter(p => p.Description === cat && p.Sold !== 'Y').length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header with Add Button */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
              Inventory Management
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Add products by ItemNo - Auto-calculated pricing from database rates
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(to right, #a855f7, #9333ea)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 15px -3px rgba(168, 85, 247, 0.3)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #9333ea, #7e22ce)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #a855f7, #9333ea)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(4, 1fr)' : window.innerWidth >= 640 ? 'repeat(2, 1fr)' : '1fr',
          gap: '20px',
        }}>
          <StatCard icon={<Package size={24} color="#9333ea" />} count={totalProducts} label="Total Products" color="#1f2937" />
          <StatCard icon={<TrendingUp size={24} color="#059669" />} count={availableProducts} label="Available" color="#059669" />
          <StatCard icon={<AlertCircle size={24} color="#dc2626" />} count={soldProducts} label="Sold Items" color="#dc2626" />
          <ValueCard value={totalValue} />
        </div>

        {/* Category Breakdown */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '24px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
            Top Categories
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(2, 1fr)' : '1fr',
            gap: '16px',
          }}>
            {categoryStats.map((cat, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  cursor: 'default',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f3e8ff';
                  e.currentTarget.style.borderColor = '#e9d5ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
                    {cat.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    {cat.available} available of {cat.count} total
                  </p>
                </div>
                <div style={{
                  padding: '8px 16px',
                  background: '#a855f7',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}>
                  {cat.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div style={{
          background: 'linear-gradient(to right, #dbeafe, #bfdbfe)',
          borderRadius: '16px',
          padding: '24px',
          border: '2px solid #93c5fd',
          cursor: 'default',
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af', marginBottom: '12px' }}>
            📝 How to Add Products
          </h4>
          <ul style={{ marginLeft: '20px', color: '#1e40af', fontSize: '14px', lineHeight: '1.8' }}>
            <li>Click "Add New Product" button above</li>
            <li>Enter product <strong>ItemNo</strong> (e.g., SR200588)</li>
            <li>System auto-fetches all details from database and calculates price</li>
            <li>Edit <strong>Display Price</strong> if needed (shown to customers)</li>
            <li>Upload images (optional - skip if images already exist)</li>
            <li>Click "Add to Inventory" to save</li>
          </ul>
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductByItemNo
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetchProducts();
          setShowAddModal(false);
        }}
      />
    </>
  );
};

// Small reusable stat card
const StatCard = ({ icon, count, label, color }) => (
  <div style={{
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '24px',
    transition: 'all 0.2s',
    cursor: 'pointer',
  }}>
    <div style={{
      background: color === '#057947' ? '#d1fae5' : 'transparent',
      padding: '12px',
      borderRadius: '12px',
      width: 'fit-content',
      marginBottom: '16px',
    }}>
      {icon}
    </div>
    <p style={{ fontSize: '32px', fontWeight: 'bold', color: color, marginBottom: '8px' }}>
      {count.toLocaleString()}
    </p>
    <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
      {label}
    </p>
  </div>
);

// Inventory value card with yellow gradient
const ValueCard = ({ value }) => (
  <div style={{
    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '2px solid #fbbf24',
    padding: '24px',
    transition: 'all 0.2s',
    cursor: 'pointer',
  }}>
    <p style={{ fontSize: '12px', color: '#92400e', fontWeight: 'bold', marginBottom: '8px' }}>
      TOTAL VALUE
    </p>
    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#78350f', marginBottom: '4px' }}>
      ₹{(value / 100000).toFixed(2)}L
    </p>
    <p style={{ fontSize: '14px', color: '#92400e', fontWeight: '600' }}>
      Inventory Worth
    </p>
  </div>
);

export default InventorySection;
