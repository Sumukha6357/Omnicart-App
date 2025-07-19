import axios from "axios";

const API_BASE = "http://localhost:8080/api/admin";
const USER_API_BASE = "http://localhost:8080/api/users";

export const fetchAllUsers = async (token) => {
  const response = await axios.get(`${API_BASE}/users`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return response.data;
};

export const updateUsername = async (userId, newUsername, token) => {
  const response = await axios.put(
    `${USER_API_BASE}/${userId}/username`,
    { name: newUsername },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }
  );
  return response.data;
};

export const updatePassword = async (userId, newPassword, token) => {
  const response = await axios.put(
    `${USER_API_BASE}/${userId}/password`,
    { password: newPassword },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }
  );
  return response.data;
};


export const fetchUsersBySeller = async (sellerId, token) => {
  const response = await axios.get(`${API_BASE}/users/seller/${sellerId}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return response.data;
};

