const BASE_URL = "http://localhost:8080/api/shipments";

// Helper to get the token and build headers
function getAuthHeaders() {
  const token = localStorage.getItem("token"); // Or from Redux if you store it there
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ✅ GET - Get shipment by order ID
export async function getShipmentByOrderId(orderId) {
  const res = await fetch(`${BASE_URL}/order/${orderId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Shipment not found");
  return await res.json();
}

// ✅ POST - Create a shipment
export async function createShipment(orderId, logisticsPartner) {
  const res = await fetch(`${BASE_URL}/${orderId}?logisticsPartner=${logisticsPartner}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to create shipment");
  return await res.json();
}

// ✅ PUT - Update shipment status
export async function updateShipmentStatus(shipmentId, status) {
  const res = await fetch(`${BASE_URL}/${shipmentId}?status=${status}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to update shipment status");
  return await res.json();
}
