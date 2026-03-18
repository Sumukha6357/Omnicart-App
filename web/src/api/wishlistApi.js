import api from "./axios";

const getAuthHeaders = (token) => {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const addToWishlist = async (userId, productId, token) => {
  const response = await api.post(`/api/wishlist/${userId}`, { productId }, {
    headers: getAuthHeaders(token),
  });
  return response.data?.data || response.data;
};

export const removeFromWishlist = async (userId, productId, token) => {
  const response = await api.delete(`/api/wishlist/${userId}/${productId}`, {
    headers: getAuthHeaders(token),
  });
  return response.data?.data || response.data;
};

export const getWishlist = async (userId, token) => {
  const response = await api.get(`/api/wishlist/${userId}`, {
    headers: getAuthHeaders(token),
  });
  return response.data?.data || response.data;
};
