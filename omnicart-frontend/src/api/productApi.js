import axios from "axios"

// ✅ Determine base URL dynamically
const BASE_API = "http://localhost:8080/api/products"

const getToken = () => localStorage.getItem("token") || ""

// ✅ Fetch all products
export const fetchAllProducts = async () => {
  const token = getToken()
  const response = await axios.get(BASE_API, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data?.data || response.data
}

export const fetchProductById = async (productId) => {
  const token = getToken()
  const response = await axios.get(`${BASE_API}/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const createProduct = async (productData, token) => {
  const response = await axios.post(BASE_API, productData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const updateProduct = async (productId, productData, token) => {
  const response = await axios.put(`${BASE_API}/${productId}`, productData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const deleteProductById = async (productId, token) => {
  console.log("Calling DELETE API for productId:", productId, "with token:", token)
  const response = await axios.delete(`${BASE_API}/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const fetchProductsBySeller = async (sellerId, token) => {
  const response = await axios.get(`${BASE_API}/seller/${sellerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
