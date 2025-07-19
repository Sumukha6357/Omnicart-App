import axios from "axios"

const API_BASE = "http://localhost:8080/api/cart"

// Get cart for a user
export const getCart = async (userId, token) => {
  const response = await axios.get(`${API_BASE}/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
  })
  return response.data
}

// Add item to cart for a user
export const addToCart = async (userId, cartItemRequest, token) => {
  // cartItemRequest: { productId, quantity }
  const response = await axios.post(
    `${API_BASE}/${userId}`,
    cartItemRequest,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }
  )
  return response.data
}

// Remove item from cart for a user
export const removeFromCart = async (userId, productId, token) => {
  const response = await axios.delete(
    `${API_BASE}/${userId}/item/${productId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }
  )
  return response.data
}
