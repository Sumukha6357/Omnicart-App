import api from "./axios"

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")
  return {
    Authorization: `Bearer ${token}`,
    "X-User-Role": role,
    "Content-Type": "application/json",
  }
}

export const getAddresses = async (userId) => {
  const response = await api.get(`/api/addresses/user/${userId}`, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const createAddress = async (userId, addressRequest) => {
  const response = await api.post(`/api/addresses/user/${userId}`, addressRequest, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const updateAddress = async (addressId, addressRequest) => {
  const response = await api.put(`/api/addresses/${addressId}`, addressRequest, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const deleteAddress = async (addressId) => {
  const response = await api.delete(`/api/addresses/${addressId}`, {
    headers: getAuthHeaders(),
  })
  return response.data
}
