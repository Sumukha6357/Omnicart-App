import axios from "axios";

const API_BASE = "http://localhost:8080/auth";

// ✅ Login Endpoint
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE}/login`, credentials);
  // Save role to localStorage
  if (response.data.role) {
    localStorage.setItem("role", response.data.role);
  }
  return response.data;
};

// ✅ Register Endpoint
export const signupUser = async (userDetails) => {
  const response = await axios.post(`${API_BASE}/register`, userDetails);
  return response.data;
};

// Example for sending role in headers for protected requests
export const getProtectedResource = async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return axios.get(`${API_BASE}/protected`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-User-Role": role,
    },
  });
};
