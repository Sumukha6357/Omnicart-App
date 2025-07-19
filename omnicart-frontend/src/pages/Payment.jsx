import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;
  const [paymentType, setPaymentType] = useState("COD");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const products = useSelector((state) => state.product.products);
  const singleProduct = useSelector((state) => state.product.product);

  useEffect(() => {
    if (!orderDetails) {
      navigate("/orders");
    }
  }, [orderDetails, navigate]);

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
  };

  if (!orderDetails) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Payment</h2>
        {!orderPlaced ? (
          <>
            <div className="mb-6 text-left">
              <p className="font-semibold mb-2">Order Summary:</p>
              <ul className="mb-2">
                {orderDetails.items.map((item, idx) => {
                  let product = products.find(p => String(p.id) === String(item.productId));
                  if (!product && singleProduct && String(singleProduct.id) === String(item.productId)) {
                    product = singleProduct;
                  }
                  const name = item.name || product?.name || item.productId;
                  return (
                    <li key={idx} className="text-sm">Product: {name}, Quantity: {item.quantity}</li>
                  );
                })}
              </ul>
              <p className="mt-2">Total: <span className="font-bold">₹{orderDetails.total}</span></p>
              <p className="mt-2">Shipping Address: <span className="font-medium">{orderDetails.address}</span></p>
            </div>
            <div className="mb-6 text-left">
              <label className="block font-semibold mb-1">Select Payment Type</label>
              <select
                className="w-full border px-4 py-2 rounded"
                value={paymentType}
                onChange={e => setPaymentType(e.target.value)}
              >
                <option value="COD">Cash on Delivery</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
            >
              Place Order
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
            >
              ← Back to Checkout
            </button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-4 text-green-700">Order Placed Successfully!</h3>
            <p className="mb-4">Payment Type: <span className="font-bold">{paymentType}</span></p>
            <button
              onClick={() => navigate("/orders")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
            >
              Go to Order History
            </button>
          </>
        )}
      </div>
    </div>
  );
}
