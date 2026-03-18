// src/api/userApi.js
import api from './axios';

const ADMIN = '/api/admin';
const USER = '/api/users';

// Optional: Inject token into every request automatically
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// ✅ Admin - Get All Users
export const fetchAllUsers = async () => {
  const res = await api.get(`${ADMIN}/users`, authHeader());
  return res.data;
};

// ✅ Update Username
export const updateUsername = async (userId, newUsername) => {
  const res = await api.put(`${USER}/${userId}/username`, { name: newUsername }, authHeader());
  return res.data;
};

// ✅ Initiate Password Reset (sends reset link to email)
export const initiatePasswordReset = async (email) => {
  // Backend expects email as query parameter
  const res = await api.put(`${USER}/password?email=${encodeURIComponent(email)}`, {}, authHeader());
  return res.data;
};

// ✅ Users By Seller
export const fetchUsersBySeller = async (sellerId) => {
  const res = await api.get(`${ADMIN}/users/seller/${sellerId}`, authHeader());
  return res.data;
};
