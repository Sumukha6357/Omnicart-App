import Sidebar from "../components/Sidebar"
import { Link } from "react-router-dom"

export default function AdminDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 bg-gray-100 min-h-screen p-6">
        <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/add-product" className="dashboard-card">
            ➕ Add New Product
          </Link>
          <Link to="/admin/products" className="dashboard-card">
            📦 Manage Products
          </Link>
          <Link to="/admin/categories" className="dashboard-card">
            📁 Manage Categories
          </Link>
          <Link to="/admin/users" className="dashboard-card">
            👥 View All Users
          </Link>
        </div>
      </div>
    </div>
  )
}
