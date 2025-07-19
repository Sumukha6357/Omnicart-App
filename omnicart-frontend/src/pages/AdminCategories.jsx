import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Sidebar from "../components/Sidebar"
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../api/categoryApi"

export default function AdminCategories() {
  const { token } = useSelector((state) => state.user)
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: "", description: "" })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadCategories = async () => {
    try {
      const data = await fetchCategories(token)
      setCategories(data)
    } catch (err) {
      console.error("❌ Failed to load categories", err)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (editingId) {
        await updateCategory(editingId, form, token)
      } else {
        await createCategory(form, token)
      }
      setForm({ name: "", description: "" })
      setEditingId(null)
      loadCategories()
    } catch (err) {
      console.error("❌ Failed to save category", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category) => {
    setForm({ name: category.name, description: category.description })
    setEditingId(category.id)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id, token)
      loadCategories()
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-8 w-full">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => window.location.href = '/admin/dashboard'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Home
          </button>
          <h2 className="text-3xl font-bold text-gray-800">Manage Categories</h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-10 max-w-xl space-y-5 border">
          <h3 className="text-xl font-bold mb-2 text-gray-700">
            {editingId ? "Edit Category" : "Add New Category"}
          </h3>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Category Name"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            placeholder="Category Description"
            className="w-full px-4 py-3 border rounded-lg resize-none h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingId ? "Update Category" : "Add Category"}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 font-medium">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="border-t hover:bg-gray-50 text-gray-800">
                  <td className="p-3 border">{idx + 1}</td>
                  <td className="p-3 border">{cat.name}</td>
                  <td className="p-3 border">{cat.description}</td>
                  <td className="p-3 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Edit
                    </button>
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
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    No categories available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
