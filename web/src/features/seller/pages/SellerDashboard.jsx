import { Link } from "react-router-dom"
import AdminLayout from "../../../components/AdminLayout"

export default function SellerDashboard() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Seller Dashboard</h2>
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Manage your products and track buyer activity.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/seller/inventory" className="dashboard-card">
          Inventory
        </Link>
        <Link to="/seller/products" className="dashboard-card">
          My Products
        </Link>
        <Link to="/seller/buyers-orders" className="dashboard-card">
          Buyers and Orders
        </Link>
        <Link to="/seller/shipments" className="dashboard-card">
          Shipments
        </Link>
      </div>
    </AdminLayout>
  )
}
