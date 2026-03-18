import api from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (role) {
    headers["X-User-Role"] = role;
  }
  return headers;
};

export const fetchReviewsByProduct = async (productId) => {
  const response = await api.get(`/api/reviews/product/${productId}`, {
    headers: getAuthHeaders(),
  });
  return response.data?.data || response.data || [];
};

export const addReview = async (productId, userId, reviewData) => {
  const response = await api.post(`/api/reviews/product/${productId}?userId=${userId}`, reviewData, {
    headers: getAuthHeaders(),
  });
  return response.data?.data || response.data;
};
