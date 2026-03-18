import api from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return {
    Authorization: `Bearer ${token}`,
    "X-User-Role": role,
    "Content-Type": "application/json",
  };
};

export const getShipmentByOrderId = async (orderId) => {
  const response = await api.get(`/api/shipments/order/${orderId}`, {
    headers: getAuthHeaders(),
  });
  return response.data?.data || response.data;
};

export const createShipment = async (orderId, logisticsPartner, trackingNumber) => {
  const params = new URLSearchParams();
  params.append("logisticsPartner", logisticsPartner);
  if (trackingNumber) {
    params.append("trackingNumber", trackingNumber);
  }
  const response = await api.post(`/api/shipments/${orderId}?${params.toString()}`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data?.data || response.data;
};

export const updateShipmentStatus = async (shipmentId, status) => {
  const params = new URLSearchParams();
  params.append("status", status);
  const response = await api.put(`/api/shipments/${shipmentId}?${params.toString()}`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data?.data || response.data;
};

export const getAllShipments = async () => {
  const response = await api.get("/api/shipments", {
    headers: getAuthHeaders(),
  });
  return response.data?.data || response.data;
};

export const getSellerShipments = async (sellerId) => {
  const response = await api.get(`/api/shipments/seller/${sellerId}`, {
    headers: getAuthHeaders(),
  });
  return response.data?.data || response.data;
};
