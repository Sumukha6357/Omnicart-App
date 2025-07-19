import axios from "axios";

const API_BASE = "http://localhost:8080/api";

// Fetch all products for a seller
export const fetchSellerProducts = async (sellerId, token) => {
  const response = await axios.get(`${API_BASE}/products/seller/${sellerId}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return response.data;
};

// Fetch all buyers for a seller
export const fetchSellerBuyers = async (sellerId, token) => {
  const response = await axios.get(`${API_BASE}/admin/users/seller/${sellerId}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return response.data;
};

// Fetch all orders for a buyer (user)
export const fetchBuyerOrders = async (userId, token) => {
  const response = await axios.get(`${API_BASE}/orders/user/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return response.data;
};
