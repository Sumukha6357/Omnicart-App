import axios from "axios";

const API_BASE = "http://localhost:8080/api/orders";

export const placeOrder = async (userId, orderRequest, token) => {
  const response = await axios.post(
    `${API_BASE}/${userId}`,
    orderRequest,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }
  );
  return response.data;
};

export const getUserOrders = async (userId, token) => {
  const response = await axios.get(`${API_BASE}/user/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return response.data;
};

export const getOrderById = async (orderId, token) => {
  const response = await axios.get(`${API_BASE}/${orderId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return response.data;
};

export const getAllOrders = async (token) => {
  const response = await axios.get(`http://localhost:8080/api/admin/orders`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return response.data;
};
