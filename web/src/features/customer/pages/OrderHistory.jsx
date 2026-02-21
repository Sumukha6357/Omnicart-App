import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../../redux/orderSlice";
import { getAllProducts } from "../../../redux/productSlice";
import { useNavigate } from "react-router-dom";
import CustomerPageShell from "../../../components/customer/CustomerPageShell";
import { formatInr } from "../../../utils/formatters";

export default function OrderHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders = [], loading } = useSelector((state) => state.order);
  const { products = [] } = useSelector((state) => state.product);

  useEffect(() => {
    if (!products.length) dispatch(getAllProducts());
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      if (userId) dispatch(fetchUserOrders({ userId }));
    } catch {}
  }, [dispatch]);

  const mergedOrders = orders || [];

  return (
    <CustomerPageShell
      userRole="customer"
      pageLabel="Orders"
      title="Your Orders"
      subtitle="Track, review, and reorder your purchases"
      actions={
        <span className="rounded-pill border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {mergedOrders.length} orders
        </span>
      }
    >
      {loading ? (
        <p className="text-slate-600 dark:text-slate-300">Loading orders...</p>
      ) : !mergedOrders?.length ? (
        <div className="rounded-card border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">No orders yet</p>
          <button
            onClick={() => navigate("/customer/home")}
            className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {mergedOrders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            const total =
              order.totalAmount ?? items.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1), 0);

            return (
              <article
                key={order.orderId || Math.random()}
                className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Order ID: <span className="font-semibold text-slate-900 dark:text-slate-100">{order.orderId}</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Date: {order.orderDate || "N/A"}</p>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => {
                    const product = products.find((p) => p.id === item.productId);
                    return (
                      <div key={item.productId || idx} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={product?.imageUrl || "/placeholder.jpg"}
                              alt={product?.name || "Product"}
                              className="h-14 w-14 rounded-lg bg-slate-100 object-contain dark:bg-slate-950"
                            />
                            <div>
                              <p className="font-semibold">{product?.name || item.productId}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {formatInr(item.price)} • Qty {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-emerald-600">
                            {formatInr(Number(item.price || 0) * Number(item.quantity || 1))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-lg font-bold">Total: {formatInr(total)}</p>
                  <button
                    onClick={() => navigate("/track-order", { state: { orderId: order.orderId } })}
                    className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    Track Order
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </CustomerPageShell>
  );
}
