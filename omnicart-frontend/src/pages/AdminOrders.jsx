import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../redux/orderSlice";
import AdminLayout from "../components/AdminLayout";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);
console.log("Orders value in component:", orders);

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">🗂️ All Orders (Admin Panel)</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-600">❌ {error}</p>
      ) : orders.length === 0 ? (
        <p className="text-lg">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white rounded shadow">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border-b">Order ID</th>
                <th className="px-4 py-2 border-b">User Name</th>
                <th className="px-4 py-2 border-b">User Email</th>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Total (₹)</th>
                <th className="px-4 py-2 border-b">Products Ordered</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{order.orderId}</td>
                  <td className="px-4 py-2 border-b">{order.userName}</td>
                  <td className="px-4 py-2 border-b">{order.userEmail}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(order.orderDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded text-white text-xs font-medium ${order.status === "PENDING" ? "bg-yellow-500" :
                        order.status === "CONFIRMED" ? "bg-blue-500" :
                          order.status === "SHIPPED" ? "bg-indigo-600" :
                            order.status === "DELIVERED" ? "bg-green-600" :
                              order.status === "CANCELLED" ? "bg-red-600" : "bg-gray-500"
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">₹{order.totalAmount}</td>
                  <td className="px-4 py-2 border-b">
                    <ul className="list-disc ml-4 space-y-1">
                      {order.items.map((item, index) => {
                        const fallbackKey = `${order.orderId}-${item.productId ?? index}`;
                        return (
                          <li key={fallbackKey}>
                            <span className="font-medium">{item.productName}</span> × {item.quantity} @ ₹{item.price}
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
