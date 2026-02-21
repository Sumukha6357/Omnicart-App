import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../../../redux/orderSlice";

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

  if (!orderDetails) {
    return null;
  }

  const handleBackHome = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const role = user?.role?.toLowerCase();
      if (role === "customer") {
        navigate("/customer/home");
        return;
      }
    } catch {}
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/customer/home" className="hover:text-blue-600">Customer</Link>
          <span className="mx-2">/</span>
          <span>Order Success</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-8 text-center">
          <div className="text-3xl font-extrabold mb-2">Thank you for your purchase!</div>
          <div className="text-sm text-gray-600 dark:text-slate-300 mb-6">
            Your order has been placed successfully.
          </div>

          <div className="text-left max-w-2xl mx-auto bg-gray-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl p-5 mb-6">
            <div className="font-bold mb-2">Order Summary</div>
            <ul className="text-sm space-y-1">
              {orderDetails.items.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{item.name || item.productId}</span>
                  <span className="text-gray-600 dark:text-slate-300">Qty {item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="border-t dark:border-slate-800 my-3"></div>
            <div className="flex items-center justify-between font-bold">
              <span>Total</span>
              <span>Rs. {orderDetails.total}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300 mt-2">
              Payment: {paymentType}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300 mt-1">
              Shipping to: {orderDetails.address}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleBackHome}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Shopping
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

