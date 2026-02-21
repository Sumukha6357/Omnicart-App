import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders, placeOrderThunk } from "../../../redux/orderSlice";
import { clearCart } from "../../../redux/cartSlice";
import CustomerPageShell from "../../../components/customer/CustomerPageShell";
import { ToastContext } from "../../../context/ToastContext";
import { formatInr } from "../../../utils/formatters";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;
  const [paymentType, setPaymentType] = useState("COD");
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const singleProduct = useSelector((state) => state.product.product);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    if (!orderDetails) {
      navigate("/orders");
    }
  }, [orderDetails, navigate]);

  const handlePlaceOrder = async () => {
    if (!orderDetails) return;
    let userId = null;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      userId = user?.id;
    } catch {}

    if (!userId) {
      showToast("You must be logged in to place an order.", "info");
      navigate("/login");
      return;
    }

    const items = Array.isArray(orderDetails.items) ? orderDetails.items : [];
    const orderRequest = {
      ...orderDetails,
      products: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    };

    try {
      setSubmitting(true);
      const placed = await dispatch(placeOrderThunk({ userId, orderRequest })).unwrap();
      if (!orderDetails.buyNow) {
        dispatch(clearCart());
        localStorage.removeItem(`omnicart_cart_${String(userId)}`);
      }
      if (placed?.orderId) localStorage.setItem("lastOrderId", placed.orderId);
      dispatch(fetchUserOrders({ userId }));
      navigate("/order-success", {
        state: { orderDetails, paymentType, orderId: placed?.orderId },
      });
    } catch {
      showToast("Failed to place order. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!orderDetails) return null;

  return (
    <CustomerPageShell
      userRole="customer"
      pageLabel="Payment"
      title="Payment"
      subtitle="Choose payment method and confirm your order"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-bold">Order Summary</h3>
            <ul className="space-y-3">
              {orderDetails.items.map((item, idx) => {
                let product = products.find((p) => String(p.id) === String(item.productId));
                if (!product && singleProduct && String(singleProduct.id) === String(item.productId)) product = singleProduct;
                const name = item.name || product?.name || item.productId;
                return (
                  <li key={idx} className="flex items-center justify-between text-sm">
                    <span>{name}</span>
                    <span className="text-slate-500 dark:text-slate-400">Qty {item.quantity}</span>
                  </li>
                );
              })}
            </ul>
            <div className="my-4 border-t border-slate-200 dark:border-slate-800" />
            <div className="flex items-center justify-between font-bold">
              <span>Total</span>
              <span>{formatInr(orderDetails.total)}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Shipping to: {orderDetails.address}</p>
          </section>

          <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-bold">Payment Method</h3>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Select payment type</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-700 dark:bg-slate-950"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
            </select>
          </section>
        </div>

        <aside className="h-fit rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-bold">Confirm Payment</h3>
          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="mt-4 w-full rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </aside>
      </div>
    </CustomerPageShell>
  );
}
