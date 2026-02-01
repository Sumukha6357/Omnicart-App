import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../../components/AdminLayout"
import { getSellerShipments, updateShipmentStatus } from "../../../api/shipmentApi"

const STATUS_OPTIONS = ["Pending", "Shipped", "Delivered", "Cancelled"]

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

export default function SellerShipments() {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState(null)
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const userStr = localStorage.getItem("user")
  const sellerId = userStr ? JSON.parse(userStr)?.id : null

  const loadShipments = async () => {
    try {
      setLoading(true)
      const data = await getSellerShipments(sellerId)
      setShipments(Array.isArray(data) ? data : [])
      setError("")
    } catch (err) {
      setError("Failed to load shipments.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (sellerId) {
      loadShipments()
    }
  }, [sellerId])

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
          to="/seller/dashboard"
          className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          Seller
        </Link>
        <span className="mx-2">/</span>
        <span>Shipments</span>
      </div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Shipments</h2>
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Track and update shipment status for your orders.
        </p>
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

      {loading ? (
        <p className="text-gray-600 dark:text-slate-300">Loading shipments...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredShipments.length === 0 ? (
        <p className="text-gray-600 dark:text-slate-300">No shipments found.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm">
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
    </AdminLayout>
  )
}
