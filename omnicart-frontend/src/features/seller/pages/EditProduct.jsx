import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import AdminLayout from "../../../components/AdminLayout"
import { fetchProductById, updateProduct } from "../../../api/productApi"

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = await fetchProductById(id)
        setProduct(data)
      } catch (err) {
        setError("Failed to load product")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem("token")
      await updateProduct(id, product, token)
      alert("Product updated successfully")
      navigate("/seller/products")
    } catch (err) {
      alert("Failed to update product")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        <Link
          to="/seller/dashboard"
          className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          Seller
        </Link>
        <span className="mx-2">/</span>
        <Link
          to="/seller/products"
          className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          Products
        </Link>
        <span className="mx-2">/</span>
        <span>Edit</span>
      </div>
      <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Edit Product</h2>
      {loading ? (
        <p className="text-gray-600 dark:text-slate-300">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800 shadow-sm max-w-lg">
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-200">Name</label>
            <input
              type="text"
              name="name"
              value={product.name || ""}
              onChange={handleChange}
              className="w-full p-2 border dark:border-slate-700 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-200">Category</label>
            <input
              type="text"
              name="categoryName"
              value={product.categoryName || ""}
              onChange={handleChange}
              className="w-full p-2 border dark:border-slate-700 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-200">Price</label>
            <input
              type="number"
              name="price"
              value={product.price || ""}
              onChange={handleChange}
              className="w-full p-2 border dark:border-slate-700 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-200">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={product.imageUrl || ""}
              onChange={handleChange}
              className="w-full p-2 border dark:border-slate-700 rounded"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/seller/products")}
              className="bg-gray-200 text-slate-700 px-4 py-2 rounded hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  )
}
