import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { fetchUsersBySeller } from "../api/userApi";
import { getUserOrders } from "../api/orderApi";
import { fetchSellerProducts } from "../api/sellerApi";

const SellerBuyersOrders = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get sellerId and token from localStorage (adapt if you use context or redux)
  let sellerId = null;
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      console.log("Parsed user object from localStorage:", userObj);
      // Try common property names
      sellerId = userObj.id; // Use the correct property for sellerId
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }
  const token = localStorage.getItem("token");
  console.log("SellerBuyersOrders: sellerId=", sellerId, "token=", token);

  // Helper: fetch all productIds for this seller
  async function getSellerProductIds(sellerId, token) {
    const products = await fetchSellerProducts(sellerId, token);
    return new Set(products.map(p => p.id || p.productId));
  }

  useEffect(() => {
    const fetchBuyersAndOrders = async () => {
      try {
        setLoading(true);
        // Fetch all productIds for this seller
        const sellerProductIds = await getSellerProductIds(sellerId, token);
        // Fetch users who bought from this seller
        const users = await fetchUsersBySeller(sellerId, token);
        console.log("Fetched users by seller:", users);
        // For each user, fetch their orders
        const buyersWithOrders = await Promise.all(
          users.map(async (user) => {
            const orders = await getUserOrders(user.id, token);
            return { user, orders };
          })
        );
        // Attach sellerProductIds for filtering
        setBuyers(buyersWithOrders.map(b => ({ ...b, sellerProductIds })));
      } catch (err) {
        setError("Failed to fetch buyers and orders: " + (err?.message || err));
        console.error("Error fetching buyers and orders:", err);
      } finally {
        setLoading(false);
      }
    };
    if (sellerId && token) fetchBuyersAndOrders();
  }, [sellerId, token]);

  if (loading) return <p>Loading buyers and orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full p-6">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Link to="/seller/dashboard" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 600, fontSize: 18, marginRight: 24 }}>&lt; Home</Link>
          <h2 style={{ margin: 0 }}>Buyers and Their Orders (Your Products Only)</h2>
        </div>
        {buyers.length === 0 ? (
          <p>No buyers found.</p>
        ) : (
        buyers.map((buyer) => {
          // For each order, filter products to only those belonging to the current seller
          // Debug: log the full order and products
          const ordersWithSellerProducts = buyer.orders
            .map(order => {
              const filteredItems = (order.items || []).filter(item => {
                // Only include items where the productId is in the seller's product set
                return buyer.sellerProductIds && buyer.sellerProductIds.has(item.productId);
              });
              return { ...order, items: filteredItems };
            })
            .filter(order => order.items.length > 0);

          return (
            <div key={buyer.user.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, margin: "1.5em 0", padding: "1.5em", background: "#fafbfc" }}>
              <h3 style={{ fontSize: "1.2em", fontWeight: 600, marginBottom: 8 }}>{buyer.user.name} <span style={{ color: '#888', fontWeight: 400 }}>({buyer.user.email})</span></h3>
              <h4 style={{ fontSize: "1em", fontWeight: 500, margin: "1em 0 0.5em 0" }}>Orders:</h4>
              {buyer.orders.length === 0 ? (
                <div style={{ color: '#b91c1c', fontStyle: 'italic', marginBottom: 8 }}>No orders found for this buyer.</div>
              ) : ordersWithSellerProducts.length === 0 ? (
                <div style={{ color: '#b91c1c', fontStyle: 'italic', marginBottom: 8 }}>No orders with your products found for this buyer.</div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1em' }}>
                  {ordersWithSellerProducts.map((order) => (
                    <div key={order.orderId || order.id} style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '1em', minWidth: 260, background: '#fff' }}>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>
                        Order <span style={{ color: '#2563eb' }}>#{order.orderId || order.id}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                        {order.date || order.createdAt} &mdash; <span style={{ color: '#059669', fontWeight: 500 }}>{order.status}</span>
                      </div>
                      <ul style={{ paddingLeft: 18, margin: 0 }}>
                        {order.items.map((item) => (
                          <li key={item.productId} style={{ fontSize: 14, marginBottom: 2 }}>
                            <span style={{ fontWeight: 500 }}>Product ID: {item.productId}</span> <span style={{ color: '#888' }}>(Qty: {item.quantity})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
    </div>
  );
};

export default SellerBuyersOrders;
