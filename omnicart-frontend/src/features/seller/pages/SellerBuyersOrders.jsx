import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../../components/AdminLayout"
import { fetchUsersBySeller } from "../../../api/userApi"
import { getUserOrders } from "../../../api/orderApi"
import { fetchSellerProducts } from "../../../api/sellerApi"

const SellerBuyersOrders = () => {
  const [buyers, setBuyers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  let sellerId = null
  const userStr = localStorage.getItem("user")
  if (userStr) {
    try {
      const userObj = JSON.parse(userStr)
      sellerId = userObj.id
    } catch (e) {
      console.error("Failed to parse user from localStorage", e)
    }
  }
  const token = localStorage.getItem("token")

  async function getSellerProductIds(currentSellerId, currentToken) {
    const products = await fetchSellerProducts(currentSellerId, currentToken)
    return new Set(products.map((p) => p.id || p.productId))
  }

  useEffect(() => {
    const fetchBuyersAndOrders = async () => {
      try {
        setLoading(true)
        const sellerProductIds = await getSellerProductIds(sellerId, token)
        const users = await fetchUsersBySeller(sellerId, token)
        const buyersWithOrders = await Promise.all(
          users.map(async (user) => {
            const orders = await getUserOrders(user.id, token)
            return { user, orders }
          })
        )
        setBuyers(buyersWithOrders.map((b) => ({ ...b, sellerProductIds })))
      } catch (err) {
        setError("Failed to fetch buyers and orders")
        console.error("Error fetching buyers and orders:", err)
      } finally {
        setLoading(false)
      }
    }
    if (sellerId && token) fetchBuyersAndOrders()
  }, [sellerId, token])

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
        <span>Buyers and Orders</span>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          Buyers and Orders
        </h2>
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Orders that include your products only.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-slate-300">Loading buyers and orders...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : buyers.length === 0 ? (
        <p className="text-gray-600 dark:text-slate-300">No buyers found.</p>
      ) : (
        <div className="space-y-6">
          {buyers.map((buyer) => {
            const ordersWithSellerProducts = buyer.orders
              .map((order) => {
                const filteredItems = (order.items || []).filter((item) => {
                  return buyer.sellerProductIds && buyer.sellerProductIds.has(item.productId)
                })
                return { ...order, items: filteredItems }
              })
              .filter((order) => order.items.length > 0)

            return (
              <div
                key={buyer.user.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    {buyer.user.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-300">
                    {buyer.user.email}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                    Orders
                  </div>
                  {buyer.orders.length === 0 ? (
                    <div className="text-sm text-red-600">No orders found for this buyer.</div>
                  ) : ordersWithSellerProducts.length === 0 ? (
                    <div className="text-sm text-red-600">
                      No orders with your products found for this buyer.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ordersWithSellerProducts.map((order) => (
                        <div
                          key={order.orderId || order.id}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-950"
                        >
                          <div className="font-semibold text-gray-900 dark:text-slate-100">
                            Order #{order.orderId || order.id}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-slate-400">
                            {order.date || order.createdAt} - {order.status}
                          </div>
                          <ul className="mt-2 space-y-1 text-xs text-gray-700 dark:text-slate-300">
                            {order.items.map((item) => (
                              <li key={item.productId}>
                                Product ID: {item.productId} (Qty: {item.quantity})
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}

export default SellerBuyersOrders
