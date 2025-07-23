import api from "./axios";

// ✅ Login Endpoint
export const loginUser = async (credentials) => {
  const response = await api.post(`/auth/login`, credentials);
  // Save role to localStorage
  if (response.data.role) {
    localStorage.setItem("role", response.data.role);
  }
  return response.data;
};

// ✅ Register Endpoint
export const signupUser = async (userDetails) => {
  const response = await api.post(`/auth/register`, userDetails);
  return response.data;
};

// Example for sending role in headers for protected requests
export const getProtectedResource = async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return api.get(`/auth/protected`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-User-Role": role,
    },
  });
};
