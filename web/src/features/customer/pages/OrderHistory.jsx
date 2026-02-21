import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../../redux/orderSlice";
import { getAllProducts } from "../../../redux/productSlice";
import { Link, useNavigate } from "react-router-dom";

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

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const userId = user?.id;
  const mergedOrders = orders || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/customer/home" className="hover:text-blue-600">Customer</Link>
          <span className="mx-2">/</span>
          <span>Orders</span>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Your Orders</h2>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              Track, review, and reorder your purchases.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm">
            <div className="text-sm text-gray-600 dark:text-slate-300">Orders</div>
            <div className="text-lg font-bold">{mergedOrders.length}</div>
          </div>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : !mergedOrders?.length ? (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
            <div className="text-lg font-semibold mb-2">No orders yet</div>
            <div className="text-sm text-gray-600 dark:text-slate-300 mb-6">
              Start shopping to see your orders here.
            </div>
            <button
              onClick={() => navigate("/customer/home")}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {mergedOrders.map((order) => {
              const items = Array.isArray(order.items) ? order.items : [];
              const total = order.totalAmount ?? items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              );

              return (
                <div key={order.orderId || Math.random()} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div className="text-sm text-gray-600 dark:text-slate-300">
                      Order ID: <span className="font-semibold text-gray-900 dark:text-slate-100">{order.orderId}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-300">
                      Date: {order.orderDate || "N/A"}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {items.map((item, idx) => {
                      const product = products.find((p) => p.id === item.productId);
                      return (
                        <div key={item.productId || idx} className="flex items-center justify-between border dark:border-slate-800 rounded-xl p-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={product?.imageUrl || "/placeholder.jpg"}
                              alt={product?.name || "Product"}
                              className="w-14 h-14 object-contain border dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-950"
                            />
                            <div>
                              <div className="font-semibold">{product?.name || item.productId}</div>
                              <div className="text-sm text-gray-600 dark:text-slate-300">
                                Rs. {item.price} • Qty {item.quantity}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-green-600">Rs. {item.price * item.quantity}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
                    <div className="font-bold text-lg">Total: Rs. {total}</div>
                    <button
                      onClick={() =>
                        navigate("/track-order", {
                          state: { orderId: order.orderId },
                        })
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
    </div>
  );
}

