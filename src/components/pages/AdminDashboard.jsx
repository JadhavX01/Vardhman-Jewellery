import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import { toast } from "sonner";

// ✅ Import AdminOrderDashboard
import AdminOrderDashboard from "./Admin/AdminOrderDashboard";

// Import Admin Components
import AdminLayout from "./Admin/AdminLayout";
import DashboardSection from "./Admin/DashboardSection";
import StaffSection from "./Admin/StaffSection";
import CustomersSection from "./Admin/CustomersSection";
import ProductsSection from "./Admin/ProductsSection";
import InventorySection from "./Admin/InventorySection";
import SettingsSection from "./Admin/SettingsSection";
import ContentManagementSection from "./Admin/ContentManagementSection";
// import AnalyticsSection from "./Admin/AnalyticsSection";

const AdminDashboard = ({ defaultSection = "dashboard" }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Main states
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);

  // New state to trigger product refreshes in other components
  const [productRefreshCounter, setProductRefreshCounter] = useState(0);

  // Function to trigger product refresh
  const refreshProducts = () => {
    setProductRefreshCounter((prev) => prev + 1);
  };

  useEffect(() => {
    if (user?.role !== "admin") {
      toast.error("Access denied. Admin only.");
      navigate("/");
      return;
    }

    fetchDashboardData();
    fetchUsers();
    fetchCustomers();
    fetchProducts();
  }, [user, navigate]);

  useEffect(() => {
    setActiveSection(defaultSection);
  }, [defaultSection]);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/admin/customers");
      setCustomers(res.data.customers || []);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products || res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #eff6ff, #ffffff, #fef3c7)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "80px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                border: "4px solid #fef3c7",
                borderRadius: "50%",
                animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                border: "4px solid #d97706",
                borderTop: "4px solid #d97706",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                inset: "12px",
                background: "linear-gradient(to bottom right, #fbbf24, #d97706)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              💎
            </div>
          </div>
          <p
            style={{
              marginTop: "24px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#1f2937",
            }}
          >
            Loading Dashboard
          </p>
          <p style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280" }}>
            Vardhaman Jewelers
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {activeSection === "dashboard" && (
        <DashboardSection
          stats={stats}
          setActiveSection={setActiveSection}
          setShowCreateStaffModal={setShowCreateStaffModal}
        />
      )}

      {activeSection === "staff" && (
        <StaffSection users={users} fetchUsers={fetchUsers} />
      )}

      {activeSection === "customers" && (
        <CustomersSection customers={customers} />
      )}

      {activeSection === "products" && (
        <ProductsSection products={products} onProductsChange={fetchProducts} />
      )}

      {activeSection === "inventory" && (
        <InventorySection
          products={products}
          fetchProducts={() => {
            fetchProducts();   // Existing fetch
            refreshProducts(); // Notify product refresh trigger for customer UI
          }}
          productRefreshCounter={productRefreshCounter} // Optional: if InventorySection needs it
        />
      )}

      {/* ✅ NEW ORDERS SECTION */}
      {activeSection === "orders" && <AdminOrderDashboard />}

      {activeSection === "content" && <ContentManagementSection />}

      {/* {activeSection === "analytics" && <AnalyticsSection />} */}

      {/* {activeSection === "settings" && <SettingsSection />} */}
    </AdminLayout>
  );
};

export default AdminDashboard;
