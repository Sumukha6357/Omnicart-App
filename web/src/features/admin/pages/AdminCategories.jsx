import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {
  fetchCategories,
  deleteCategory,
} from "../../../api/categoryApi"
import AdminLayout from "../../../components/AdminLayout"

export default function AdminCategories() {
  const { token } = useSelector((state) => state.user)
  const [categories, setCategories] = useState([])

  const loadCategories = async () => {
    try {
      const data = await fetchCategories(token)
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load categories", err)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id, token)
      loadCategories()
    }
  }

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
        <span>Categories</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Manage Categories</h2>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            Add, edit, and organize product categories.
          </p>
        </div>
        <Link
          to="/admin/add-category"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Add Category
        </Link>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-slate-950 text-gray-700 dark:text-slate-200 font-medium">
            <tr>
              <th className="p-3 border-b dark:border-slate-800">#</th>
              <th className="p-3 border-b dark:border-slate-800">Name</th>
              <th className="p-3 border-b dark:border-slate-800">Description</th>
              <th className="p-3 border-b dark:border-slate-800 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <tr key={cat.id} className="border-t dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                <td className="p-3 border-b dark:border-slate-800">{idx + 1}</td>
                <td className="p-3 border-b dark:border-slate-800">{cat.name}</td>
                <td className="p-3 border-b dark:border-slate-800">{cat.description}</td>
                <td className="p-3 border-b dark:border-slate-800 text-center space-x-2">
                  <Link
                    to={`/admin/add-category?id=${cat.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400 dark:text-slate-500">
                  No categories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
