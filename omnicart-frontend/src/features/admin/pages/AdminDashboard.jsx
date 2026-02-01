import { Link } from "react-router-dom"
import AdminLayout from "../../../components/AdminLayout"

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Admin Dashboard</h2>
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Manage products, users, and orders from one place.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/warehouses" className="dashboard-card">
          Manage Warehouses
        </Link>
        <Link to="/admin/inventory" className="dashboard-card">
          Manage Inventory
        </Link>
        <Link to="/admin/categories" className="dashboard-card">
          Manage Categories
        </Link>
        <Link to="/admin/products" className="dashboard-card">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="dashboard-card">
          View All Orders
        </Link>
        <Link to="/admin/shipments" className="dashboard-card">
          Manage Shipments
        </Link>
        <Link to="/admin/users" className="dashboard-card">
          View All Users
        </Link>
      </div>
    </AdminLayout>
  )
}
