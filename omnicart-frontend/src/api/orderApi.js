import api from "./axios";

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

// ✅ Place an order for a user
export const placeOrder = async (userId, orderRequest) => {
  const response = await api.post(`/api/orders/${userId}`, orderRequest, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Get orders for a specific user
export const getUserOrders = async (userId) => {
  const response = await api.get(`/api/orders/user/${userId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Get a specific order by ID
export const getOrderById = async (orderId) => {
  const response = await api.get(`/api/orders/${orderId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Admin: Get all orders
export const getAllOrders = async () => {
  const response = await api.get(`/api/admin/orders`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
