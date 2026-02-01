// src/api/shipmentApi.js
import api from './axios';

// 🔐 Auth headers helper
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return {
    Authorization: `Bearer ${token}`,
    "X-User-Role": role,
    "Content-Type": "application/json",
  };
};

// 📦 Get shipment by order ID
export const getShipmentByOrderId = async (orderId) => {
  const response = await api.get(`/api/shipments/order/${orderId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// 🚚 Create a new shipment
export const createShipment = async (orderId, logisticsPartner, trackingNumber) => {
  const trackingParam = trackingNumber ? `&trackingNumber=${encodeURIComponent(trackingNumber)}` : "";
  const response = await api.post(
    `/api/shipments/${orderId}?logisticsPartner=${encodeURIComponent(logisticsPartner)}${trackingParam}`,
    null, // no body needed
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

// 🔄 Update shipment status
export const updateShipmentStatus = async (shipmentId, status) => {
  const response = await api.put(
    `/api/shipments/${shipmentId}?status=${status}`,
    null, // no body needed
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

// 📋 Get all shipments (admin)
export const getAllShipments = async () => {
  const response = await api.get(`/api/shipments`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// 📦 Get seller shipments
export const getSellerShipments = async (sellerId) => {
  const response = await api.get(`/api/shipments/seller/${sellerId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
