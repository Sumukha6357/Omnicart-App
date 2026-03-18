import api from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (role) {
    headers["X-User-Role"] = role;
  }
  return headers;
};

// Map backend product response to frontend format
const toUiProduct = (p) => ({
  id: String(p.id),
  name: p.name ?? "Unnamed Product",
  description: p.description ?? "",
  price: Number(p.price ?? 0),
  quantity: Number(p.quantity ?? 0),
  rating: Number(p.rating ?? 0), // Backend doesn't provide this yet
  categoryName: p.categoryName ?? "Uncategorized",
  imageUrl: p.imageUrl ?? "",
  sellerId: p.sellerId ?? null, // Backend doesn't provide this yet
  sellerName: p.sellerName ?? "Unknown Seller",
  brand: p.brand ?? "", // Backend doesn't provide this yet
  reviews: Array.isArray(p.reviews) ? p.reviews : [], // Backend doesn't provide this yet
  createdAt: p.createdAt ?? new Date().toISOString(),
  popularity: Number(p.popularity ?? 0), // Backend doesn't provide this yet
});

export const fetchAllProducts = async (params = {}) => {
  const response = await api.get("/api/products", {
    headers: getAuthHeaders(),
    params,
  });
  const data = response.data?.data || response.data;
  return Array.isArray(data) ? data.map(toUiProduct) : [];
};

export const fetchProductById = async (productId) => {
  const response = await api.get(`/api/products/${productId}`, {
    headers: getAuthHeaders(),
  });
  const data = response.data?.data || response.data;
  return toUiProduct(data);
};

export const createProduct = async (productData) => {
  const response = await api.post("/api/products", productData, {
    headers: getAuthHeaders(),
  });
  const data = response.data?.data || response.data;
  return toUiProduct(data);
};

export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/api/products/${productId}`, productData, {
    headers: getAuthHeaders(),
  });
  const data = response.data?.data || response.data;
  return toUiProduct(data);
};

export const deleteProductById = async (productId) => {
  const response = await api.delete(`/api/products/${productId}`, {
    headers: getAuthHeaders(),
  });
  return { success: response.status === 204, id: String(productId) };
};

export const fetchProductsBySeller = async (sellerId, params = {}) => {
  const response = await api.get(`/api/products/seller/${sellerId}`, {
    headers: getAuthHeaders(),
    params,
  });
  const data = response.data?.data || response.data;
  return Array.isArray(data) ? data.map(toUiProduct) : [];
};
