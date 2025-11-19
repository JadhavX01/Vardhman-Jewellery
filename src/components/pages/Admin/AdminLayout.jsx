import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  LayoutDashboard,
  UserCog,
  Users,
  Package,
  ShoppingBag,
  ShoppingCart, // ✅ ADD THIS LINE
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
} from "lucide-react";

const AdminLayout = ({ children, activeSection, setActiveSection }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/staff-login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "staff", label: "Staff", icon: UserCog },
    { id: "customers", label: "Customers", icon: Users },
    { id: "products", label: "Products", icon: Package },
    { id: "inventory", label: "Inventory", icon: ShoppingBag },
    { id: "orders", label: "Orders", icon: ShoppingCart }, // ✅ NEW ORDERS MENU
    { id: "content", label: "Content", icon: FileText },
    // { id: "analytics", label: "Analytics", icon: BarChart3 },
    // { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'linear-gradient(to bottom right, #f9fafb, #eff6ff, #fef3c7)',
      overflow: 'hidden',
      colorScheme: 'light',
    }}>
      {/* Sidebar */}
      <aside
        style={{
          position: sidebarOpen && window.innerWidth < 1024 ? 'fixed' : window.innerWidth >= 1024 ? 'static' : 'fixed',
          inset: '0 auto 0 0',
          zIndex: 50,
          width: sidebarOpen ? '256px' : window.innerWidth >= 1024 ? '80px' : '256px',
          transform: sidebarOpen || window.innerWidth >= 1024 ? 'translateX(0)' : 'translateX(-100%)',
          background: '#ffffff',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s',
        }}
      >
        {/* Logo */}
        <div style={{
          height: '64px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(to right, #fef3c7, #fed7aa)',
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(to bottom right, #fbbf24, #d97706)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}>
                <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '18px' }}>V</span>
              </div>
              <div>
                <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', lineHeight: 1.2 }}>
                  Vardhaman
                </h1>
                <p style={{ fontSize: '10px', color: '#6b7280' }}>Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#fef3c7'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {sidebarOpen ? <X size={18} color="#374151" /> : <Menu size={18} color="#374151" />}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          overflowY: 'auto',
          background: 'linear-gradient(to bottom, #ffffff, #f9fafb)',
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                background: activeSection === item.id
                  ? 'linear-gradient(to right, #f59e0b, #d97706)'
                  : 'transparent',
                color: activeSection === item.id ? '#ffffff' : '#374151',
                boxShadow: activeSection === item.id
                  ? '0 10px 15px -3px rgba(245, 158, 11, 0.3)'
                  : 'none',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.background = 'linear-gradient(to right, #fef3c7, #fed7aa)';
                  e.currentTarget.style.color = '#d97706';
                }
              }}
              onMouseOut={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#374151';
                }
              }}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          background: 'linear-gradient(to right, #f9fafb, #fef3c7)',
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', padding: '8px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(to bottom right, #fbbf24, #d97706)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#ffffff',
                fontSize: '14px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}>
                {user?.name?.charAt(0) || "A"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#1f2937',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {user?.name || "Admin"}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                  {user?.role}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: '8px',
              padding: sidebarOpen ? '10px 16px' : '10px',
              background: 'linear-gradient(to right, #ef4444, #dc2626)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #dc2626, #b91c1c)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #ef4444, #dc2626)'}
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
          }}
        />
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          height: '64px',
          background: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                display: window.innerWidth >= 1024 ? 'none' : 'flex',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <Menu size={20} color="#374151" />
            </button>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                {navItems.find((item) => item.id === activeSection)?.label}
              </h2>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>Manage operations efficiently</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          background: 'linear-gradient(to bottom right, #f9fafb, #eff6ff, #fef3c7)',
        }}>
          <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
