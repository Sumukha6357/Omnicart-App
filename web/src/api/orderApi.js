import api from "./axios";

const getAuthHeaders = (token) => {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const placeOrder = async (userId, orderRequest, token) => {
  const response = await api.post(`/api/orders/${userId}`, orderRequest, {
    headers: getAuthHeaders(token),
  });
  return response.data?.data || response.data;
};

export const getUserOrders = async (userId, token) => {
  const response = await api.get(`/api/orders/user/${userId}`, {
    headers: getAuthHeaders(token),
  });
  return response.data?.data || response.data;
};

export const getOrderById = async (orderId, token) => {
  const response = await api.get(`/api/orders/${orderId}`, {
    headers: getAuthHeaders(token),
  });
  return response.data?.data || response.data;
};

export const getAllOrders = async (token) => {
  // This endpoint might not exist in the backend, but we can use /api/orders with admin privileges
  // For now, return an empty array or implement based on backend
  return [];
};
