const ORDERS_KEY = 'omnicart_orders'
const SHIPMENTS_KEY = 'omnicart_shipments'

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const newId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`

const toOrderItems = (items = []) => {
  return items.map((item) => ({
    productId: String(item.productId),
    quantity: Number(item.quantity || 1),
    price: Number(item.price || 0),
    name: item.name || 'Product',
  }))
}

export const placeOrder = async (userId, orderRequest) => {
  const orders = readJson(ORDERS_KEY, [])
  const shipments = readJson(SHIPMENTS_KEY, [])

  const items = toOrderItems(orderRequest?.items || [])
  const totalAmount = Number(
    orderRequest?.total ||
      orderRequest?.totalAmount ||
      items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const now = new Date().toISOString()
  const orderId = newId('ORD')

  const order = {
    orderId,
    userId: String(userId),
    userName: orderRequest?.userName || 'Customer',
    orderDate: now,
    status: 'Pending',
    address: orderRequest?.address || '',
    totalAmount,
    paymentType: orderRequest?.paymentType || 'COD',
    items,
  }

  orders.unshift(order)
  writeJson(ORDERS_KEY, orders)

  const shipment = {
    shipmentId: newId('SHP'),
    orderId,
    sellerId: orderRequest?.sellerId || items?.[0]?.sellerId || null,
    logisticsPartner: null,
    trackingNumber: null,
    status: 'Pending',
    shippedAt: now,
    estimatedDelivery: null,
  }
  shipments.unshift(shipment)
  writeJson(SHIPMENTS_KEY, shipments)

  return order
}

export const getUserOrders = async (userId) => {
  const orders = readJson(ORDERS_KEY, [])
  return orders.filter((o) => String(o.userId) === String(userId))
}

export const getOrderById = async (orderId) => {
  const orders = readJson(ORDERS_KEY, [])
  return orders.find((o) => String(o.orderId) === String(orderId)) || null
}

export const getAllOrders = async () => {
  return readJson(ORDERS_KEY, [])
}
