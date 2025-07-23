import api from "./axios";

// ✅ Utility to get token and role from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return {
    Authorization: `Bearer ${token}`,
    "X-User-Role": role,
  };
};

// ✅ Fetch all products
export const fetchAllProducts = async () => {
  const response = await api.get(`/api/products`, {
    headers: getAuthHeaders(),
  });
  return response.data?.data || response.data;
};

// ✅ Fetch product by ID
export const fetchProductById = async (productId) => {
  const response = await api.get(`/api/products/${productId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Create a new product
export const createProduct = async (productData) => {
  const response = await api.post(`/api/products`, productData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Update product
export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/api/products/${productId}`, productData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Delete product
export const deleteProductById = async (productId) => {
  console.log("Calling DELETE API for productId:", productId);
  const response = await api.delete(`/api/products/${productId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Fetch products by seller
export const fetchProductsBySeller = async (sellerId) => {
  const response = await api.get(`/api/products/seller/${sellerId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
