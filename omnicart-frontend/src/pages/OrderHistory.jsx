import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../redux/orderSlice";
import { getAllProducts } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";

export default function OrderHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders = [], loading } = useSelector((state) => state.order);
  const { products = [] } = useSelector((state) => state.product);

  useEffect(() => {
    if (!products.length) {
      dispatch(getAllProducts());
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      if (userId) {
        dispatch(fetchUserOrders({ userId }));
      }
    } catch (err) {
      console.error("Invalid user in localStorage", err);
    }
  }, [dispatch]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-bold"
      >
        <span className="text-2xl mr-1">&#60;</span> Home
      </button>

      <h2 className="text-2xl font-bold mb-6">📦 Your Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : !orders?.length ? (
        <p className="text-lg">You have not placed any orders yet.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            const total = items.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            );

            return (
              <div key={order.orderId || Math.random()} className="bg-white shadow rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-semibold">Order ID:</span>{" "}
                    {order.orderId}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span>{" "}
                    {order.orderDate || "N/A"}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm mb-2">
                    <thead className="bg-gray-100 text-left">
                      <tr>
                        <th className="px-4 py-2 border-b">Image</th>
                        <th className="px-4 py-2 border-b">Product</th>
                        <th className="px-4 py-2 border-b">Price</th>
                        <th className="px-4 py-2 border-b">Quantity</th>
                        <th className="px-4 py-2 border-b">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => {
                        const product = products.find(
                          (p) => p.id === item.productId
                        );

                        return (
                          <tr key={item.productId || idx}>
                            <td className="px-4 py-2 border-b">
                              <img
                                src={
                                  product?.imageUrl || "/placeholder.jpg"
                                }
                                alt={product?.name || "Product"}
                                className="w-12 h-12 object-contain border rounded"
                              />
                            </td>
                            <td className="px-4 py-2 border-b">
                              {product?.name || item.productId}
                            </td>
                            <td className="px-4 py-2 border-b">
                              ₹{item.price}
                            </td>
                            <td className="px-4 py-2 border-b">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-2 border-b">
                              ₹{item.price * item.quantity}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="font-bold">Total: ₹{total}</div>
                  <button
                    onClick={() =>
                      navigate("/track-order", {
                        state: { orderId: order.orderId },
                      })
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
