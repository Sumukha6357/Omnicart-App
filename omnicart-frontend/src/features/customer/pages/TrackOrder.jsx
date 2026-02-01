// components/TrackOrder.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchShipmentByOrderId, clearShipmentState } from "../../../redux/shipmentSlice";

export default function TrackOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderIdFromState = location.state?.orderId;
  const orderId = orderIdFromState || localStorage.getItem("lastOrderId") || "";
  const dispatch = useDispatch();
  const { shipment, loading, error } = useSelector((state) => state.shipment);

  useEffect(() => {
    dispatch(clearShipmentState());
    return () => dispatch(clearShipmentState());
  }, [dispatch]);

  useEffect(() => {
    if (!orderId) {
      navigate("/orders");
      return;
    }
    dispatch(fetchShipmentByOrderId(orderId));
  }, [orderId, dispatch, navigate]);

  const getTrackingUrl = (carrier, trackingNumber) => {
    if (!carrier || !trackingNumber) return null;
    const code = encodeURIComponent(trackingNumber);
    const normalized = carrier.toLowerCase();
    if (normalized.includes("fedex")) return `https://www.fedex.com/fedextrack/?trknbr=${code}`;
    if (normalized.includes("dhl")) return `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${code}`;
    if (normalized.includes("ups")) return `https://www.ups.com/track?tracknum=${code}`;
    if (normalized.includes("usps")) return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${code}`;
    if (normalized.includes("bluedart")) return `https://www.bluedart.com/trackdartresult?trackFor=0&trackNo=${code}`;
    if (normalized.includes("delhivery")) return `https://www.delhivery.com/track/package/${code}`;
    return null;
  };

  const statusSteps = [
    { key: "PENDING", label: "Order Placed" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const statusMap = {
    PENDING: "PENDING",
    CREATED: "PENDING",
    CONFIRMED: "CONFIRMED",
    PROCESSING: "CONFIRMED",
    SHIPPED: "SHIPPED",
    IN_TRANSIT: "SHIPPED",
    OUT_FOR_DELIVERY: "SHIPPED",
    DELIVERED: "DELIVERED",
  };

  const rawStatus = shipment?.status ? String(shipment.status).toUpperCase() : "PENDING";
  const normalizedStatus = statusMap[rawStatus] || "PENDING";
  const currentIndex = statusSteps.findIndex((step) => step.key === normalizedStatus);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900 px-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow max-w-2xl w-full">
        <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/customer/home" className="hover:text-blue-600">Customer</Link>
          <span className="mx-2">/</span>
          <span>Track Order</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Track Your Order</h2>
        <p className="text-sm text-gray-600 dark:text-slate-300 mb-6">
          Order ID: <span className="font-semibold">{orderId}</span>
        </p>

        {loading && <p className="text-gray-600 dark:text-slate-300 mb-4">Fetching shipment...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {shipment && (
          <div className="text-left">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Shipment Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {statusSteps.map((step, idx) => {
                  const done = idx <= currentIndex;
                  return (
                    <div
                      key={step.key}
                      className={`rounded-xl border px-3 py-3 text-center ${
                        done
                          ? "border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900/20 dark:text-green-300"
                          : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      <div className="text-xs uppercase tracking-wide">{step.label}</div>
                      {done && <div className="text-sm font-semibold">Done</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipment ID</span>
                <span className="font-semibold">{shipment.shipmentId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold">{shipment.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Logistics Partner</span>
                <span className="font-semibold">{shipment.logisticsPartner || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tracking</span>
                <span className="font-semibold">
                  {shipment.trackingNumber ? (
                    (() => {
                      const url = getTrackingUrl(shipment.logisticsPartner, shipment.trackingNumber);
                      return url ? (
                        <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          {shipment.trackingNumber}
                        </a>
                      ) : (
                        shipment.trackingNumber
                      );
                    })()
                  ) : (
                    "N/A"
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Estimated Delivery</span>
                <span className="font-semibold">{shipment.estimatedDelivery || "N/A"}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

