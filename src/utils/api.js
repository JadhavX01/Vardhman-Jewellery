// frontend/src/utils/api.js
import axios from "axios";

// Try to use the configured IP, fallback to localhost
// const getBaseURL = () => {
//   // Check if we're in development
//   if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//     return "http://localhost:5000/api";
//   }
//   // Use the configured IP for production/network access
//   return "http://192.168.1.9:5000/api";
// };
const getBaseURL = () => {
  if (window.location.hostname === 'jadhavx01.github.io') {
    return "https://unretracted-adelia-savourily.ngrok-free.dev/api";
  }
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return "http://localhost:5000/api";
  }
  return "https://unretracted-adelia-savourily.ngrok-free.dev/api";
};




const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - attach token to every request
API.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("vardhaman_user");
    if (storedUser) {
      try {
        const { token } = JSON.parse(storedUser);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Error parsing stored user:", err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("vardhaman_user");
      
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ========== AUTH APIs ==========
export const authAPI = {
  register: (data) => API.post("/auth/customer/register", data),
  verifyOTP: (data) => API.post("/auth/customer/verify-otp", data),
  login: (data) => API.post("/auth/customer/login", data),
  staffAdminLogin: (data) => API.post("/auth/staff-admin/login", data),
  resendOTP: (data) => API.post("/auth/resend-otp", data),
  getMe: () => API.get("/auth/me"),
  logout: () => API.post("/auth/logout"),
};

// ========== PRODUCT APIs ✅ NEW ==========
export const productAPI = {
  // Get all products with filters
  getAllProducts: (params) => API.get("/products", { params }),
  
  // Get featured products (for homepage)
  getFeaturedProducts: (limit = 8) => API.get("/products/featured", { params: { limit } }),
  
  // Get product by LotNo
  getProductByLotNo: (lotNo) => API.get(`/products/${lotNo}`),
  
  // Get products by category
  getProductsByCategory: (category, params) => API.get(`/products/category/${category}`, { params }),
  
  // Search products
  searchProducts: (searchTerm) => API.get("/products/search", { params: { q: searchTerm } }),
  
  // Add new product (admin only)
  addProduct: (data) => API.post("/products", data),
  
  // ✅ NEW: Update existing product (admin only)
  updateProduct: (lotNo, data) => API.put(`/products/${lotNo}`, data),
  
  // ✅ NEW: Delete product (admin only)
  deleteProduct: (lotNo) => API.delete(`/products/${lotNo}`),
  
  // Get current gold/silver rate
  getRate: (params) => API.get("/products/rate", { params }),
};

// ========== STOCK APIs ==========
export const stockAPI = {
  // Get all stock items with filters
  getAllItems: (params) => API.get("/stock", { params }),
  
  // Get featured products (for homepage)
  getFeaturedProducts: (limit = 8) => API.get("/stock/featured", { params: { limit } }),
  
  // Get item by LotNo
  getItemByLotNo: (lotNo) => API.get(`/stock/${lotNo}`),
  
  // Get items by category
  getItemsByCategory: (categoryId, params) => API.get(`/stock/category/${categoryId}`, { params }),
  
  // Search items
  searchItems: (searchTerm) => API.get("/stock/search", { params: { search: searchTerm } }),
};

// ========== CUSTOMER APIs (Add later) ==========
export const customerAPI = {
  // getProfile: () => API.get("/customers/profile"),
  // updateProfile: (data) => API.put("/customers/profile", data),
};

export default API;