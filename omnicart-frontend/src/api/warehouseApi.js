import api from "./axios"

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")
  const headers = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  if (role) {
    headers["X-User-Role"] = role
  }
  return headers
}

export const fetchWarehouses = async () => {
  const response = await api.get("/api/warehouses", {
    headers: getAuthHeaders(),
  })
  return response.data?.data || response.data
}

export const createWarehouse = async (payload) => {
  const response = await api.post("/api/warehouses", payload, {
    headers: getAuthHeaders(),
  })
  return response.data?.data || response.data
}

export const updateWarehouse = async (warehouseId, payload) => {
  const response = await api.put(`/api/warehouses/${warehouseId}`, payload, {
    headers: getAuthHeaders(),
  })
  return response.data?.data || response.data
}

export const deleteWarehouse = async (warehouseId) => {
  const response = await api.delete(`/api/warehouses/${warehouseId}`, {
    headers: getAuthHeaders(),
  })
  return response.data?.data || response.data
}
