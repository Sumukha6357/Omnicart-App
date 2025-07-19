import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { fetchProductById, updateProduct } from "../api/productApi"

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
      alert("Product updated successfully!")
      navigate("/admin/products")
    } catch (err) {
      alert("Failed to update product")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 bg-gray-100 min-h-screen p-6">
        {/* Home Button */}
        <div className="mb-4">
          <Link
            to={(() => {
              const userStr = localStorage.getItem("user");
              if (userStr) {
                try {
                  const userObj = JSON.parse(userStr);
                  return userObj.role?.toLowerCase() === "admin"
                    ? "/admin/products"
                    : "/seller/products";
                } catch {}
              }
              return "/";
            })()}
            style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 600, fontSize: 18 }}
          >
            &lt; Home
          </Link>
        </div>
        <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-lg">
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={product.name || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Category</label>
              <input
                type="text"
                name="categoryName"
                value={product.categoryName || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={product.price || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Image URL</label>
              <input
                type="text"
                name="imageUrl"
                value={product.imageUrl || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
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
                onClick={() => navigate('/admin/dashboard')}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}