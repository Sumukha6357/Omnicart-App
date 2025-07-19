import { Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"

export default function SellerDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full min-h-screen p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6">Welcome, Seller!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/seller/add-product" className="dashboard-card">
            ➕ Add New Product
          </Link>
          <Link to="/seller/products" className="dashboard-card">
            📦 My Products
          </Link>
          <Link to="/seller/buyers-orders" className="dashboard-card">
            📑 Buyers & Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
