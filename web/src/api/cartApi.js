import api from "./axios";

const getAuthHeaders = (token) => {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const getCart = async (userId, token) => {
  const response = await api.get(`/api/cart/${userId}`, {
    headers: getAuthHeaders(token),
  });
  return response.data?.data || response.data;
};

export const addToCart = async (userId, cartItemRequest, token) => {
  const response = await api.post(`/api/cart/${userId}`, cartItemRequest, {
    headers: getAuthHeaders(token),
  });
  return response.data?.data || response.data;
};

export const removeFromCart = async (userId, productId, token) => {
  const response = await api.delete(`/api/cart/${userId}/item/${productId}`, {
    headers: getAuthHeaders(token),
  });
  return response.data?.data || response.data;
};
