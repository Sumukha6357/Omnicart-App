const SHIPMENTS_KEY = 'omnicart_shipments'

const readShipments = () => {
  try {
    const raw = localStorage.getItem(SHIPMENTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const writeShipments = (shipments) => {
  localStorage.setItem(SHIPMENTS_KEY, JSON.stringify(shipments))
}

const newId = () => `SHP-${Date.now()}-${Math.floor(Math.random() * 100000)}`

export const getShipmentByOrderId = async (orderId) => {
  const shipments = readShipments()
  const shipment = shipments.find((s) => String(s.orderId) === String(orderId))
  if (!shipment) {
    throw new Error('Shipment not found')
  }
  return shipment
}

export const createShipment = async (orderId, logisticsPartner, trackingNumber) => {
  const shipments = readShipments()
  const existing = shipments.find((s) => String(s.orderId) === String(orderId))

  if (existing) {
    existing.logisticsPartner = logisticsPartner || existing.logisticsPartner
    existing.trackingNumber = trackingNumber || existing.trackingNumber
    existing.status = existing.status || 'Pending'
    existing.shippedAt = existing.shippedAt || new Date().toISOString()
    writeShipments(shipments)
    return existing
  }

  const shipment = {
    shipmentId: newId(),
    orderId: String(orderId),
    logisticsPartner: logisticsPartner || null,
    trackingNumber: trackingNumber || null,
    status: 'Pending',
    shippedAt: new Date().toISOString(),
    estimatedDelivery: null,
  }

  shipments.unshift(shipment)
  writeShipments(shipments)
  return shipment
}

export const updateShipmentStatus = async (shipmentId, status) => {
  const shipments = readShipments()
  const shipment = shipments.find((s) => String(s.shipmentId) === String(shipmentId))
  if (!shipment) {
    throw new Error('Shipment not found')
  }
  shipment.status = status
  if (!shipment.shippedAt) {
    shipment.shippedAt = new Date().toISOString()
  }
  writeShipments(shipments)
  return shipment
}

export const getAllShipments = async () => {
  return readShipments()
}

export const getSellerShipments = async (sellerId) => {
  const shipments = readShipments()
  const filtered = shipments.filter((s) => String(s.sellerId) === String(sellerId))
  return filtered.length > 0 ? filtered : shipments
}
