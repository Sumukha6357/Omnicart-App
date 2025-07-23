// src/api/cartApi.js
import api from './axios'

// 🔧 Auth headers helper
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return {
    Authorization: `Bearer ${token}`,
    "X-User-Role": role,
    "Content-Type": "application/json",
  };
};

// 🛒 Get cart for a user
export const getCart = async (userId) => {
  const response = await api.get(`/api/cart/${userId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ➕ Add item to cart
export const addToCart = async (userId, cartItemRequest) => {
  const response = await api.post(
    `/api/cart/${userId}`,
    cartItemRequest,
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

// ❌ Remove item from cart
export const removeFromCart = async (userId, productId) => {
  const response = await api.delete(
    `/api/cart/${userId}/item/${productId}`,
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};
