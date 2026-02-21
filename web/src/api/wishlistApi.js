// src/api/wishlistApi.js
import api from './axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ➕ Add to wishlist
export const addToWishlist = async (userId, productId) => {
  const response = await api.post(
    `/api/wishlist/${userId}`,
    { productId },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// ➖ Remove from wishlist
export const removeFromWishlist = async (userId, productId) => {
  const response = await api.delete(
    `/api/wishlist/${userId}/${productId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// 📜 Get user's wishlist
export const getWishlist = async (userId) => {
  const response = await api.get(`/api/wishlist/${userId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
