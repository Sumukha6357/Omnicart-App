import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders, placeOrderThunk } from "../../../redux/orderSlice";
import { clearCart } from "../../../redux/cartSlice";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;
  const [paymentType, setPaymentType] = useState("COD");
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const singleProduct = useSelector((state) => state.product.product);

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
      alert("You must be logged in to place an order.");
      navigate("/login");
      return;
    }

    const items = Array.isArray(orderDetails.items) ? orderDetails.items : [];
    const realItems = items;
    const orderRequest = {
      ...orderDetails,
      products: realItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      setSubmitting(true);
      const placed = await dispatch(placeOrderThunk({ userId, orderRequest })).unwrap();
      if (!orderDetails.buyNow) {
        dispatch(clearCart());
        localStorage.removeItem(`omnicart_cart_${String(userId)}`);
      }
      if (placed?.orderId) {
        localStorage.setItem("lastOrderId", placed.orderId);
      }
      dispatch(fetchUserOrders({ userId }));
      navigate("/order-success", {
        state: {
          orderDetails,
          paymentType,
          orderId: placed?.orderId,
        },
      });
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!orderDetails) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/customer/home" className="hover:text-blue-600">Customer</Link>
          <span className="mx-2">/</span>
          <span>Payment</span>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Payment</h2>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              Choose a payment method and confirm your order.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <ul className="space-y-3">
                {orderDetails.items.map((item, idx) => {
                  let product = products.find(p => String(p.id) === String(item.productId));
                  if (!product && singleProduct && String(singleProduct.id) === String(item.productId)) {
                    product = singleProduct;
                  }
                  const name = item.name || product?.name || item.productId;
                  return (
                    <li key={idx} className="flex items-center justify-between text-sm">
                      <span>{name}</span>
                      <span className="text-gray-600 dark:text-slate-300">Qty {item.quantity}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t dark:border-slate-800 my-4"></div>
              <div className="flex items-center justify-between font-bold">
                <span>Total</span>
                <span>Rs. {orderDetails.total}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-300 mt-2">
                Shipping to: {orderDetails.address}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Payment Method</h3>
              <label className="block font-semibold mb-2">Select payment type</label>
              <select
                className="w-full border dark:border-slate-700 px-4 py-2 rounded"
                value={paymentType}
                onChange={e => setPaymentType(e.target.value)}
              >
                <option value="COD">Cash on Delivery</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6 h-fit">
            <h3 className="text-lg font-bold mb-4">Confirm Payment</h3>
            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-60"
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

