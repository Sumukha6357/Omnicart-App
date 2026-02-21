// src/api/sellerApi.js
import api from "./axios";
import { fetchProductsBySeller } from "./productApi";

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

const BASE_URL = "/api";

// 📦 Fetch all products for a seller
export const fetchSellerProducts = async (sellerId) => {
  return fetchProductsBySeller(sellerId);
};

// 👥 Fetch all buyers for a seller
export const fetchSellerBuyers = async (sellerId) => {
  const response = await api.get(`${BASE_URL}/admin/users/seller/${sellerId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// 📦📦 Fetch all orders for a buyer (user)
export const fetchBuyerOrders = async (userId) => {
  const response = await api.get(`${BASE_URL}/orders/user/${userId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
