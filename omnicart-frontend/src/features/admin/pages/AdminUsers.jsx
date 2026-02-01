import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchAllUsers } from "../../../api/userApi"
import AdminLayout from "../../../components/AdminLayout"

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetchAllUsers(token)
      .then((data) => {
        setUsers(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch users")
        setLoading(false)
      })
  }, [])

  return (
    <AdminLayout>
      <div className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        <Link
          to="/admin/dashboard"
          className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          Admin
        </Link>
        <span className="mx-2">/</span>
        <span>Users</span>
      </div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Users</h2>
        <p className="text-sm text-gray-600 dark:text-slate-300">
          View all registered users.
        </p>
      </div>
      {loading ? (
        <p className="text-gray-600 dark:text-slate-300">Loading users...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-slate-950 text-gray-700 dark:text-slate-200">
              <tr>
                <th className="px-4 py-3 border-b dark:border-slate-800">Name</th>
                <th className="px-4 py-3 border-b dark:border-slate-800">Email</th>
                <th className="px-4 py-3 border-b dark:border-slate-800">Role</th>
                <th className="px-4 py-3 border-b dark:border-slate-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 border-b dark:border-slate-800">{user.name}</td>
                  <td className="px-4 py-3 border-b dark:border-slate-800">{user.email}</td>
                  <td className="px-4 py-3 border-b dark:border-slate-800">{user.role}</td>
                  <td className="px-4 py-3 border-b dark:border-slate-800">-</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400 dark:text-slate-500">
                    No users available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
