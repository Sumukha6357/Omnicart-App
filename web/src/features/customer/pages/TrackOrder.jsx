import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchShipmentByOrderId, clearShipmentState } from "../../../redux/shipmentSlice";
import CustomerPageShell from "../../../components/customer/CustomerPageShell";

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
    <CustomerPageShell
      userRole="customer"
      pageLabel="Track Order"
      title="Track Your Order"
      subtitle={`Order ID: ${orderId}`}
    >
      <div className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading && <p className="mb-4 text-slate-600 dark:text-slate-300">Fetching shipment...</p>}
        {error && <p className="mb-4 text-red-600">{error}</p>}

        {shipment && (
          <div>
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold">Shipment Status</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
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

            <div className="space-y-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
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
                        <a href={url} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
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
    </CustomerPageShell>
  );
}
