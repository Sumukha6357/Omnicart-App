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

export const fetchAllInventory = async () => {
  const response = await api.get("/api/inventory/all", {
    headers: getAuthHeaders(),
  })
  return response.data?.data || response.data
}

export const updateInventory = async (productId, quantity) => {
  const response = await api.post(
    `/api/inventory/update/${productId}`,
    { quantity },
    { headers: getAuthHeaders() }
  )
  return response.data
}

export const fetchSellerInventory = async (sellerId) => {
  const response = await api.get(`/api/inventory/seller/${sellerId}`, {
    headers: getAuthHeaders(),
  })
  return response.data?.data || response.data
}

export const fetchWarehouseInventory = async (warehouseId) => {
  const response = await api.get(`/api/inventory/warehouse/${warehouseId}`, {
    headers: getAuthHeaders(),
  })
  return response.data?.data || response.data
}

export const fetchAllWarehouseInventory = async () => {
  const response = await api.get("/api/inventory/warehouses", {
    headers: getAuthHeaders(),
  })
  return response.data?.data || response.data
}

export const fetchSellerWarehouseInventory = async (sellerId) => {
  const response = await api.get(`/api/inventory/warehouse/seller/${sellerId}`, {
    headers: getAuthHeaders(),
  })
  return response.data?.data || response.data
}

export const fetchSellerWarehouseInventoryByWarehouse = async (sellerId, warehouseId) => {
  const response = await api.get(`/api/inventory/warehouse/${warehouseId}/seller/${sellerId}`, {
    headers: getAuthHeaders(),
  })
  return response.data?.data || response.data
}

export const adjustInventory = async (payload) => {
  const response = await api.post("/api/inventory/adjust", payload, {
    headers: getAuthHeaders(),
  })
  return response.data?.data || response.data
}

export const deleteWarehouseInventory = async (warehouseId, productId) => {
  const response = await api.delete(`/api/inventory/warehouse/${warehouseId}/product/${productId}`, {
    headers: getAuthHeaders(),
  })
  return response.data?.data || response.data
}

export const fetchStockMovements = async (warehouseId, productId) => {
  const params = {}
  if (warehouseId) params.warehouseId = warehouseId
  if (productId) params.productId = productId
  const response = await api.get("/api/inventory/movements", {
    headers: getAuthHeaders(),
    params,
  })
  return response.data?.data || response.data
}
