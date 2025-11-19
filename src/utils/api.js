// frontend/src/utils/api.js
import axios from "axios";

// ✅ DYNAMIC BASE URL DETECTION
const getBaseURL = () => {
  // 1️⃣ Check for environment variable (highest priority)
  if (import.meta.env.VITE_API_URL) {
    console.log("🔧 Using VITE_API_URL:", import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }

  // 2️⃣ Production: GitHub Pages deployment
  if (window.location.hostname === 'jadhavx01.github.io') {
    const ngrokURL = "https://unretracted-adelia-savourily.ngrok-free.dev/api";
    console.log("🌐 Production mode - Using ngrok:", ngrokURL);
    return ngrokURL;
  }

  // 3️⃣ Local development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log("🏠 Development mode - Using localhost");
    return "http://localhost:5000/api";
  }

  // 4️⃣ Network access (LAN)
  const lanURL = "http://192.168.1.9:5000/api";
  console.log("📱 LAN mode - Using:", lanURL);
  return lanURL;
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // ✅ Increased to 30 seconds for ngrok latency
  withCredentials: false, // ✅ Set to false for ngrok (unless you need cookies)
});

// ✅ Request interceptor - attach token to every request
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
        console.error("❌ Error parsing stored user:", err);
      }
    }
    
    // ✅ Log requests in development
    if (import.meta.env.DEV) {
      console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor - handle auth errors and logging
API.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.url}`, response.status);
    }
    return response;
  },
  (error) => {
    // ✅ Enhanced error logging
    if (error.response) {
      console.error(`❌ API Error [${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.error("❌ No response from server:", error.request);
      console.error("🔍 Possible causes: CORS, network, or server down");
    } else {
      console.error("❌ Request setup error:", error.message);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("vardhaman_user");
      
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login" && 
          !window.location.pathname.includes("/admin")) {
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

// ========== PRODUCT APIs ==========
export const productAPI = {
  getAllProducts: (params) => API.get("/products", { params }),
  getFeaturedProducts: (limit = 8) => API.get("/products/featured", { params: { limit } }),
  getProductByLotNo: (lotNo) => API.get(`/products/${lotNo}`),
  getProductsByCategory: (category, params) => API.get(`/products/category/${category}`, { params }),
  searchProducts: (searchTerm) => API.get("/products/search", { params: { q: searchTerm } }),
  addProduct: (data) => API.post("/products", data),
  updateProduct: (lotNo, data) => API.put(`/products/${lotNo}`, data),
  deleteProduct: (lotNo) => API.delete(`/products/${lotNo}`),
  getRate: (params) => API.get("/products/rate", { params }),
};

// ========== STOCK APIs ==========
export const stockAPI = {
  getAllItems: (params) => API.get("/stock", { params }),
  getFeaturedProducts: (limit = 8) => API.get("/stock/featured", { params: { limit } }),
  getItemByLotNo: (lotNo) => API.get(`/stock/${lotNo}`),
  getItemsByCategory: (categoryId, params) => API.get(`/stock/category/${categoryId}`, { params }),
  searchItems: (searchTerm) => API.get("/stock/search", { params: { search: searchTerm } }),
};

// ========== CUSTOMER APIs ==========
export const customerAPI = {
  // Future implementation
};

export default API;