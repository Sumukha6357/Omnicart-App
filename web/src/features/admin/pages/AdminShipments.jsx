import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import AdminLayout from "../../../components/AdminLayout"
import { fetchAllOrders } from "../../../redux/orderSlice"
import { createShipment, getAllShipments, updateShipmentStatus } from "../../../api/shipmentApi"

const STATUS_OPTIONS = ["Pending", "Shipped", "Delivered", "Cancelled"]
const CARRIER_OPTIONS = ["FedEx", "DHL", "UPS", "USPS", "BlueDart", "Delhivery", "Other"]

const getTrackingUrl = (carrier, trackingNumber) => {
  if (!carrier || !trackingNumber) return null
  const code = encodeURIComponent(trackingNumber)
  const normalized = carrier.toLowerCase()
  if (normalized.includes("fedex")) return `https://www.fedex.com/fedextrack/?trknbr=${code}`
  if (normalized.includes("dhl")) return `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${code}`
  if (normalized.includes("ups")) return `https://www.ups.com/track?tracknum=${code}`
  if (normalized.includes("usps")) return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${code}`
  if (normalized.includes("bluedart")) return `https://www.bluedart.com/trackdartresult?trackFor=0&trackNo=${code}`
  if (normalized.includes("delhivery")) return `https://www.delhivery.com/track/package/${code}`
  return null
}

export default function AdminShipments() {
  const dispatch = useDispatch()
  const { orders, loading: ordersLoading, error: ordersError } = useSelector((state) => state.order)
  const [shipments, setShipments] = useState([])
  const [loadingShipments, setLoadingShipments] = useState(true)
  const [shipmentsError, setShipmentsError] = useState("")
  const [partnerDraft, setPartnerDraft] = useState({})
  const [trackingDraft, setTrackingDraft] = useState({})
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [updatingId, setUpdatingId] = useState(null)
  const [creatingId, setCreatingId] = useState(null)

  const loadShipments = async () => {
    try {
      setLoadingShipments(true)
      const data = await getAllShipments()
      setShipments(Array.isArray(data) ? data : [])
      setShipmentsError("")
    } catch (err) {
      setShipmentsError("Failed to load shipments.")
    } finally {
      setLoadingShipments(false)
    }
  }

  useEffect(() => {
    dispatch(fetchAllOrders())
    loadShipments()
  }, [dispatch])

  const shipmentByOrderId = useMemo(() => {
    const map = new Map()
    shipments.forEach((shipment) => {
      map.set(String(shipment.orderId), shipment)
    })
    return map
  }, [shipments])

  const pendingOrders = useMemo(() => {
    return (Array.isArray(orders) ? orders : []).filter(
      (order) => !shipmentByOrderId.has(String(order.orderId))
    )
  }, [orders, shipmentByOrderId])

  const handleCreateShipment = async (orderId) => {
    const logisticsPartner = (partnerDraft[orderId] || "").trim()
    const trackingNumber = (trackingDraft[orderId] || "").trim()
    if (!logisticsPartner) {
      alert("Please enter a logistics partner.")
      return
    }
    try {
      setCreatingId(orderId)
      await createShipment(orderId, logisticsPartner, trackingNumber || undefined)
      setPartnerDraft((prev) => ({ ...prev, [orderId]: "" }))
      setTrackingDraft((prev) => ({ ...prev, [orderId]: "" }))
      await loadShipments()
    } catch (err) {
      alert("Failed to create shipment.")
    } finally {
      setCreatingId(null)
    }
  }

  const handleUpdateStatus = async (shipmentId, status) => {
    try {
      setUpdatingId(shipmentId)
      await updateShipmentStatus(shipmentId, status)
      await loadShipments()
    } catch (err) {
      alert("Failed to update shipment.")
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredShipments = useMemo(() => {
    let result = [...shipments]
    if (statusFilter !== "ALL") {
      result = result.filter((shipment) => shipment.status === statusFilter)
    }
    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      result = result.filter((shipment) => shipment.shippedAt && new Date(shipment.shippedAt) >= fromDate)
    }
    if (dateTo) {
      const toDate = new Date(dateTo)
      toDate.setHours(23, 59, 59, 999)
      result = result.filter((shipment) => shipment.shippedAt && new Date(shipment.shippedAt) <= toDate)
    }
    return result
  }, [shipments, statusFilter, dateFrom, dateTo])

  return (
    <AdminLayout>
      <div className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        <Link
          to="/admin/dashboard"
          className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          Admin
        </Link>
        <span className="mx-2">/</span>
        <span>Shipments</span>
      </div>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Manage Shipments</h2>
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Create shipments for new orders and update delivery status.
        </p>
      </div>

      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Orders awaiting shipment
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Create a shipment to mark the order as shipped.
              </p>
            </div>
          </div>

          {ordersLoading ? (
            <p className="text-gray-600 dark:text-slate-300">Loading orders...</p>
          ) : ordersError ? (
            <p className="text-red-600">Failed to load orders.</p>
          ) : pendingOrders.length === 0 ? (
            <p className="text-gray-600 dark:text-slate-300">No orders waiting for shipment.</p>
          ) : (
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-800"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase text-slate-500 dark:text-slate-400">
                        Order ID
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {order.orderId}
                      </div>
                      <div className="text-slate-600 dark:text-slate-300">
                        {order.userName || "Customer"} · Rs. {order.totalAmount}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        value={partnerDraft[order.orderId] || ""}
                        onChange={(e) =>
                          setPartnerDraft((prev) => ({
                            ...prev,
                            [order.orderId]: e.target.value,
                          }))
                        }
                        placeholder="Carrier name"
                        list={`carrier-options-${order.orderId}`}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      />
                      <datalist id={`carrier-options-${order.orderId}`}>
                        {CARRIER_OPTIONS.map((carrier) => (
                          <option key={carrier} value={carrier} />
                        ))}
                      </datalist>
                      <input
                        value={trackingDraft[order.orderId] || ""}
                        onChange={(e) =>
                          setTrackingDraft((prev) => ({
                            ...prev,
                            [order.orderId]: e.target.value,
                          }))
                        }
                        placeholder="Tracking ID (optional)"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      />
                      <button
                        onClick={() => handleCreateShipment(order.orderId)}
                        disabled={creatingId === order.orderId}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        {creatingId === order.orderId ? "Creating..." : "Create shipment"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Active shipments
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Update shipment status as it moves through delivery.
              </p>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="ALL">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          {loadingShipments ? (
            <p className="text-gray-600 dark:text-slate-300">Loading shipments...</p>
          ) : shipmentsError ? (
            <p className="text-red-600">{shipmentsError}</p>
          ) : filteredShipments.length === 0 ? (
            <p className="text-gray-600 dark:text-slate-300">No shipments created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-slate-950 text-gray-700 dark:text-slate-200">
                  <tr>
                    <th className="px-4 py-3 border-b dark:border-slate-800">Shipment</th>
                    <th className="px-4 py-3 border-b dark:border-slate-800">Order</th>
                    <th className="px-4 py-3 border-b dark:border-slate-800">Partner</th>
                    <th className="px-4 py-3 border-b dark:border-slate-800">Tracking</th>
                    <th className="px-4 py-3 border-b dark:border-slate-800">Status</th>
                    <th className="px-4 py-3 border-b dark:border-slate-800">Shipped</th>
                    <th className="px-4 py-3 border-b dark:border-slate-800 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.shipmentId} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                      <td className="px-4 py-3 border-b dark:border-slate-800">
                        {shipment.shipmentId}
                      </td>
                      <td className="px-4 py-3 border-b dark:border-slate-800">
                        {shipment.orderId}
                      </td>
                      <td className="px-4 py-3 border-b dark:border-slate-800">
                        {shipment.logisticsPartner || "—"}
                      </td>
                      <td className="px-4 py-3 border-b dark:border-slate-800">
                        {shipment.trackingNumber ? (
                          (() => {
                            const url = getTrackingUrl(shipment.logisticsPartner, shipment.trackingNumber)
                            return url ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline dark:text-blue-400"
                              >
                                {shipment.trackingNumber}
                              </a>
                            ) : (
                              shipment.trackingNumber
                            )
                          })()
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 border-b dark:border-slate-800">
                        <select
                          value={shipment.status || "Pending"}
                          onChange={(e) => handleUpdateStatus(shipment.shipmentId, e.target.value)}
                          className="rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                          disabled={updatingId === shipment.shipmentId}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 border-b dark:border-slate-800">
                        {shipment.shippedAt ? new Date(shipment.shippedAt).toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-3 border-b dark:border-slate-800 text-right">
                        {updatingId === shipment.shipmentId ? (
                          <span className="text-xs text-slate-500">Updating...</span>
                        ) : (
                          <span className="text-xs text-slate-500">Ready</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  )
}
