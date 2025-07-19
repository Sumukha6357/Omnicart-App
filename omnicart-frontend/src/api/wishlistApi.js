import axios from "axios";

const BASE_URL = "http://localhost:8080/api/wishlist";

// ✅ Centralized Auth Header using the correct token
const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // token stored separately
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Add item to wishlist
export const addToWishlist = async (userId, productId) => {
  const response = await axios.post(
    `${BASE_URL}/${userId}`,
    { productId },
    getAuthHeader()
  );
  return response.data;
};

// ✅ Remove item from wishlist
export const removeFromWishlist = async (userId, productId) => {
  const response = await axios.delete(
    `${BASE_URL}/${userId}/${productId}`,
    getAuthHeader()
  );
  return response.data;
};

// ✅ Get all wishlist items for a user
export const getWishlist = async (userId) => {
  const token = localStorage.getItem("token"); // fetch token correctly
  const response = await fetch(`${BASE_URL}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }
  return await response.json();
};
