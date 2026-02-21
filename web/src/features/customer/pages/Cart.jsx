import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, fetchCart } from "../../../redux/cartSlice";
import { ToastContext } from "../../../context/ToastContext";
import CustomerPageShell from "../../../components/customer/CustomerPageShell";
import { formatInr } from "../../../utils/formatters";

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useContext(ToastContext);
  const { products = [] } = useSelector((state) => state.product);
  const cart = useSelector((state) => state.cart.cartItems) || [];

  const total = cart.reduce((acc, item) => {
    const product = products.find((p) => String(p.id) === String(item.productId));
    const price = Number(product ? product.price : item.price || 0);
    return acc + price * Number(item.quantity || 1);
  }, 0);

  const handleRemove = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.id;
    if (!userId) {
      showToast("Please login first.", "info");
      return;
    }
    await dispatch(removeItem({ userId, productId }));
    await dispatch(fetchCart({ userId }));
    showToast("Removed from cart.", "info");
  };

  return (
    <CustomerPageShell
      userRole="customer"
      pageLabel="Cart"
      title="Your Cart"
      subtitle="Review items and proceed to secure checkout"
      actions={
        <span className="rounded-pill border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {cart.length} items
        </span>
      }
    >
      {cart.length === 0 ? (
        <div className="rounded-card border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">Your cart is empty</p>
          <button
            onClick={() => navigate("/customer/home")}
            className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => {
              const product = products.find((p) => String(p.id) === String(item.productId));
              const price = Number(product?.price ?? item.price ?? 0);
              const subtotal = price * Number(item.quantity || 1);
              return (
                <article
                  key={item.productId}
                  className="rounded-card border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={product?.imageUrl || item.imageUrl || "/placeholder.jpg"}
                        alt={product?.name || item.name || "Product"}
                        className="h-20 w-20 rounded-lg bg-slate-100 object-contain dark:bg-slate-950"
                      />
                      <div>
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {product?.name || item.name || "Unnamed Product"}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {formatInr(price)} • Qty {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-emerald-600">Subtotal: {formatInr(subtotal)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="self-start rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="h-fit rounded-card border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Order Summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span>{formatInr(total)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="my-3 border-t border-slate-200 dark:border-slate-800" />
            <div className="flex items-center justify-between text-lg font-bold text-slate-900 dark:text-slate-100">
              <span>Total</span>
              <span>{formatInr(total)}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="mt-2 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              View Order History
            </button>
          </aside>
        </div>
      )}
    </CustomerPageShell>
  );
}
