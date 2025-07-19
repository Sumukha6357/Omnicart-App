// components/TrackOrder.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShipmentByOrderId, clearShipmentState } from "../redux/shipmentSlice";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const dispatch = useDispatch();
  const { shipment, loading, error } = useSelector(state => state.shipment);

  // Clear old shipment data on mount
  useEffect(() => {
    dispatch(clearShipmentState());
    // Optionally, also clear on unmount
    return () => dispatch(clearShipmentState());
  }, [dispatch]);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    dispatch(fetchShipmentByOrderId(orderId));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow max-w-md w-full text-center">
        <button
          onClick={() => window.location.href = "/orders"}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-bold"
        >
          <span className="text-2xl mr-1">&#60;</span> Back
        </button>
        <h2 className="text-2xl font-bold mb-6">Track Your Order</h2>
        <form onSubmit={handleTrack} className="mb-6">
          <input
            type="text"
            className="border px-4 py-2 rounded w-full mb-4"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
            disabled={loading}
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </form>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {shipment && (
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-2">Shipment Details</h3>
            <p><strong>Order ID:</strong> {shipment.orderId}</p>
            <p><strong>Shipment ID:</strong> {shipment.shipmentId}</p>
            <p><strong>Status:</strong> {shipment.status}</p>
            <p><strong>Logistics Partner:</strong> {shipment.logisticsPartner}</p>
            <p><strong>Tracking Number:</strong> {shipment.trackingNumber || "N/A"}</p>
            <p><strong>Estimated Delivery:</strong> {shipment.estimatedDeliveryDate || "N/A"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
