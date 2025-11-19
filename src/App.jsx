import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Header } from "./components/layout/Header.jsx";
import { Footer } from "./components/layout/Footer.js";
import Cart from "./components/shared/Cart.jsx";
import ProductDetailModal from "./components/shared/ProductDetailModal.jsx";
import CheckoutPage from "./components/pages/CheckoutPage.jsx";
import { Toaster, toast } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute.js";
import OrderHistoryPage from "./components/pages/OrderHistoryPage.jsx";
import AdminOrderDashboard from "./components/pages/Admin/AdminOrderDashboard.jsx";
import AdminLayout from "./components/pages/Admin/AdminLayout.jsx";
import AboutPage from "./components/pages/AboutPage.jsx";
import ContactPage from "./components/pages/ContactPage.jsx";
import AOS from 'aos'; // Import AOS

// Pages
import HomePage  from "./components/pages/HomePage.jsx";
import CollectionsPage from "./components/pages/CollectionsPage";
import { SearchPage } from "./components/pages/SearchPage.js";
import ProfilePage from "./components/pages/ProfilePage.jsx";
import WishlistPage from "./components/pages/WishlistPage.jsx";

// Auth Pages
import LoginPage from "./components/pages/LoginPage.jsx";
import RegisterPage from "./components/pages/RegisterPage.jsx";
import VerifyOtpPage from "./components/pages/VerifyOtpPage.jsx";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./components/pages/ResetPasswordPage.jsx";
import StaffAdminLoginPage from "./components/pages/StaffAdminLoginPage.jsx";

// Admin Pages
import AdminDashboard from "./components/pages/AdminDashboard.jsx";

export default function App() {
  const location = useLocation();

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  // Refresh AOS on route change
  useEffect(() => {
    AOS.refresh();
  }, [location.pathname]);

  // Pages without layout
  const noLayoutPages = [
    "/admin-dashboard",
    "/staff-dashboard",
    "/staff-login",
    "/admin/orders",
    "/login",
    "/register",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
  ];

  const showLayout = !noLayoutPages.includes(location.pathname);

  // ========== FETCH CART & WISHLIST ON LOAD ==========
  useEffect(() => {
    const fetchCartAndWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const custId = localStorage.getItem("custId");
        if (!token || !custId) return;

        // Fetch Cart from backend
        const cartRes = await fetch(`http://localhost:5000/api/cart/${custId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = await cartRes.json();

        if (cartData.success && cartData.data.length > 0) {
          setCartItems(cartData.data);
          localStorage.setItem(`cart_${custId}`, JSON.stringify(cartData.data));
        } else {
          const savedCart = localStorage.getItem(`cart_${custId}`);
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        }

        // Fetch Wishlist from backend
        const wishRes = await fetch(`http://localhost:5000/api/wishlist/${custId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wishData = await wishRes.json();

        if (wishData.success && wishData.data.length > 0) {
          setWishlistItems(wishData.data);
          localStorage.setItem(`wishlist_${custId}`, JSON.stringify(wishData.data));
        } else {
          const savedWish = localStorage.getItem(`wishlist_${custId}`);
          if (savedWish) {
            setWishlistItems(JSON.parse(savedWish));
          }
        }
      } catch (err) {
        console.error("Failed to load cart or wishlist:", err);
      }
    };

    fetchCartAndWishlist();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const custId = localStorage.getItem("custId");
      
      if (!token || !custId) return;

      const cartRes = await fetch(`http://localhost:5000/api/cart/${custId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const cartData = await cartRes.json();

      if (cartData.success) {
        setCartItems(cartData.data || []);
        localStorage.setItem(`cart_${custId}`, JSON.stringify(cartData.data || []));
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  // ========== CART HANDLERS ==========
  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const custId = localStorage.getItem("custId");

      if (!token || !custId) {
        toast.error("Please login to add to cart");
        return;
      }

      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          custId,
          itemNo: product.ItemNo,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const cartRes = await fetch(`http://localhost:5000/api/cart/${custId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = await cartRes.json();
        if (cartData.success) setCartItems(cartData.data || []);

        toast.success(`${product.Description} added to cart`);
      } else {
        toast.error(data.message || "Failed to add item to cart");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Error adding item to cart");
    }
  };

  const handleUpdateQuantity = async (cartId, quantity) => {
    if (quantity <= 0) return;

    try {
      const token = localStorage.getItem("token");
      const custId = localStorage.getItem("custId");

      if (!token || !custId) {
        toast.error("Please login");
        return;
      }

      const res = await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartId,
          quantity,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.CartId === cartId
              ? { ...item, Quantity: quantity, quantity }
              : item
          )
        );
      } else {
        toast.error(data.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Error updating quantity");
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      const token = localStorage.getItem("token");
      const custId = localStorage.getItem("custId");

      if (!token || !custId) {
        toast.error("Please login");
        return;
      }

      const item = cartItems.find((item) => item.CartId === cartId);

      const res = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setCartItems((prev) => prev.filter((item) => item.CartId !== cartId));
        if (item) toast.error(`${item.Description} removed from cart`);
      } else {
        toast.error(data.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Error removing item from cart");
    }
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    const custId = localStorage.getItem("custId");
    localStorage.removeItem(`cart_${custId}`);
    setIsCartOpen(false);
    toast.success("Order placed successfully!");
  };

  const handleToggleWishlist = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const custId = localStorage.getItem("custId");

      if (!token || !custId) {
        toast.error("Please login to manage wishlist");
        return;
      }

      const productId = product.LotNo || product.ItemNo;

      const isInWishlist = wishlistItems.some(
        (item) => (item.LotNo || item.ItemNo) === productId
      );

      if (isInWishlist) {
        const wishlistItem = wishlistItems.find(
          (item) => (item.LotNo || item.ItemNo) === productId
        );

        const res = await fetch(
          `http://localhost:5000/api/wishlist/${wishlistItem.WishlistId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (data.success) {
          setWishlistItems((prev) =>
            prev.filter((item) => (item.LotNo || item.ItemNo) !== productId)
          );
          
          const updated = wishlistItems.filter((item) => (item.LotNo || item.ItemNo) !== productId);
          localStorage.setItem(`wishlist_${custId}`, JSON.stringify(updated));
          
          toast.error(`${product.Description} removed from wishlist`);
        }
      } else {
        const res = await fetch("http://localhost:5000/api/wishlist/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            custId,
            itemNo: product.ItemNo,
            lotNo: product.LotNo,
          }),
        });

        const data = await res.json();

        if (data.success) {
          const wishRes = await fetch(
            `http://localhost:5000/api/wishlist/${custId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const wishData = await wishRes.json();
          
          if (wishData.success) {
            setWishlistItems(wishData.data || []);
            localStorage.setItem(`wishlist_${custId}`, JSON.stringify(wishData.data || []));
          }

          toast.success(`${product.Description} added to wishlist`);
        }
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      toast.error("Error updating wishlist");
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => (item.LotNo || item.ItemNo) === productId || item.ItemNo === productId
    );
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.Quantity || item.quantity || 1),
    0
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#f5f5f5" }}>
      {showLayout && (
        <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      )}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/staff-login" element={<StaffAdminLoginPage />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/content-management"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard defaultSection="content" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <div style={{ padding: "32px", textAlign: "center" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
                  Staff Dashboard
                </h1>
                <p style={{ color: "#666", marginTop: "8px" }}>Coming soon...</p>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <AdminLayout activeSection="inventory" setActiveSection={setActiveSection}>
                <AdminOrderDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route
          path="/"
          element={
            <HomePage
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={isInWishlist}
            />
          }
        />

        <Route
          path="/collections"
          element={
            <CollectionsPage
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={isInWishlist}
            />
          }
        />

        <Route
          path="/search"
          element={
            <SearchPage
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={isInWishlist}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <WishlistPage
                wishlistItems={wishlistItems}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                onToggleWishlist={handleToggleWishlist}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CheckoutPage
                cartItems={cartItems}
                onOrderComplete={handleOrderComplete}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} /> 
      </Routes>

      {showLayout && <Footer />}

      {showLayout && (
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          fetchCartItems={fetchCartItems} 
        />
      )}

      {showLayout && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isInWishlist={
            selectedProduct ? isInWishlist(selectedProduct.ItemNo) : false
          }
        />
      )}

      <Toaster position="top-right" richColors />
    </div>
  );
}
