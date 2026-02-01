import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { fetchAllOrders } from "../../../redux/orderSlice"
import AdminLayout from "../../../components/AdminLayout"

const statusClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800"
    case "SHIPPED":
      return "bg-indigo-100 text-indigo-800"
    case "DELIVERED":
      return "bg-green-100 text-green-800"
    case "CANCELLED":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export default function AdminOrders() {
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector((state) => state.order)

  useEffect(() => {
    dispatch(fetchAllOrders())
  }, [dispatch])

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
        <span>Orders</span>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">All Orders</h2>
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Latest orders from all customers.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-slate-300">Loading orders...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load orders.</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 dark:text-slate-300">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">Order ID</div>
                  <div className="font-semibold text-gray-900 dark:text-slate-100">
                    {order.orderId}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-slate-400">Customer</div>
                  <div className="font-semibold text-gray-900 dark:text-slate-100">
                    {order.userName || "Unknown"}
                  </div>
                  <div className="text-gray-600 dark:text-slate-300">{order.userEmail}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-slate-400">Date</div>
                  <div className="text-gray-900 dark:text-slate-100">
                    {order.orderDate ? new Date(order.orderDate).toLocaleString() : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-slate-400">Total</div>
                  <div className="text-green-700 dark:text-green-400 font-bold">
                    Rs. {order.totalAmount}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-500 dark:text-slate-400 mb-2">
                  Items
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {order.items?.map((item, index) => {
                    const key = `${order.orderId}-${item.productId ?? index}`
                    return (
                      <div
                        key={key}
                        className="border dark:border-slate-800 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-slate-950"
                      >
                        <div className="font-semibold text-gray-900 dark:text-slate-100">
                          {item.productName || "Product"}
                        </div>
                        <div className="text-gray-600 dark:text-slate-300">
                          Qty {item.quantity} - Rs. {item.price}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
