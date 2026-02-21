import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../../../redux/orderSlice";
import CustomerPageShell from "../../../components/customer/CustomerPageShell";
import { formatInr } from "../../../utils/formatters";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderDetails = location.state?.orderDetails;
  const paymentType = location.state?.paymentType || "COD";

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      if (userId) {
        dispatch(fetchUserOrders({ userId }));
      }
    } catch {}
  }, [dispatch]);

  if (!orderDetails) return null;

  return (
    <CustomerPageShell
      userRole="customer"
      pageLabel="Order Success"
      title="Thank you for your purchase"
      subtitle="Your order has been placed successfully"
    >
      <div className="rounded-card border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-slate-200 bg-slate-50 p-5 text-left dark:border-slate-800 dark:bg-slate-950">
          <h3 className="mb-2 font-bold">Order Summary</h3>
          <ul className="space-y-1 text-sm">
            {orderDetails.items.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span>{item.name || item.productId}</span>
                <span className="text-slate-500 dark:text-slate-400">Qty {item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="my-3 border-t border-slate-200 dark:border-slate-800" />
          <div className="flex items-center justify-between font-bold">
            <span>Total</span>
            <span>{formatInr(orderDetails.total)}</span>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Payment: {paymentType}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Shipping to: {orderDetails.address}</p>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/customer/home")}
            className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Back to Shopping
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            View Order History
          </button>
        </div>
      </div>
    </CustomerPageShell>
  );
}
