import API from "../utils/api";
import { Product } from "../types/Product";

// Response type from backend
interface ProductResponse {
  success: boolean;
  count: number;
  data: Product[];
  message?: string;
}

interface SingleProductResponse {
  success: boolean;
  data: Product;
  message?: string;
}

// ========== GET ALL PRODUCTS ==========
export const getAllProducts = async (params?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<Product[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    const response = await API.get<ProductResponse>(
      `/products?${queryParams.toString()}`
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// ========== GET FEATURED PRODUCTS ==========
export const getFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
  try {
    const response = await API.get<ProductResponse>(
      `/products/featured?limit=${limit}`
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
};

// ========== GET PRODUCT BY LOTNO ==========
export const getProductByLotNo = async (lotNo: string): Promise<Product | null> => {
  try {
    const response = await API.get<SingleProductResponse>(`/products/${lotNo}`);
    return response.data.data || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// ========== GET PRODUCTS BY CATEGORY ==========
export const getProductsByCategory = async (
  category: string,
  params?: { limit?: number; offset?: number }
): Promise<Product[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    const response = await API.get<ProductResponse>(
      `/products/category/${category}?${queryParams.toString()}`
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

// ========== SEARCH PRODUCTS ==========
export const searchProducts = async (
  query: string,
  limit: number = 20
): Promise<Product[]> => {
  try {
    const response = await API.get<ProductResponse>(
      `/products/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// ========== HELPER: Get Product Image URL ==========
export const getProductImageUrl = (product: Product): string => {
  // Check if product has images
  if (product.images && product.images.length > 0 && product.images[0]) {
    // If it's an object with FilePath
    if (typeof product.images[0] === "object" && "FilePath" in product.images[0]) {
      const filePath = product.images[0].FilePath;
      // Return the FilePath if it exists (backend already converts it to /images/...)
      if (filePath) {
        return filePath;
      }
    }
    // If it's a string (direct path)
    if (typeof product.images[0] === "string") {
      return product.images[0];
    }
  }

  // Return empty string if no image (ProductCard will handle showing "No Image")
  return '';
};

// ========== HELPER: Get Placeholder Image ==========
export const getPlaceholderImage = (type?: string): string => {
  const placeholders: Record<string, string> = {
    ring: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    necklace: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
    bracelet: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
    earring: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
    default: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
  };

  return type && placeholders[type.toLowerCase()]
    ? placeholders[type.toLowerCase()]
    : placeholders.default;
};

// ========== HELPER: Format Price ==========
export const formatPrice = (amount: number | undefined | null): string => {
  // Handle invalid values or zero
  if (!amount || isNaN(amount) || amount === 0) {
    return "Price on Request";
  }
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// ========== HELPER: Check if Product is Available ==========
export const isProductAvailable = (product: Product): boolean => {
  return !product.Sold || product.Sold !== "Y";
};
