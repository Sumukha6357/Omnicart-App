import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { createProduct } from "../../../api/productApi"
import { fetchCategories } from "../../../api/categoryApi"
import AdminLayout from "../../../components/AdminLayout"

export default function AddProduct({ embedded = false }) {
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.user)

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    imageUrl: "",
  })

  const [categories, setCategories] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories(token)
        setCategories(res)
      } catch (err) {
        console.error("Failed to load categories:", err)
      }
    }
    loadCategories()
  }, [token])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setUploading(true)

      await createProduct({ ...form, sellerId: user.id }, token)

      alert("Product added successfully")
      navigate(user.role.toLowerCase() === "admin" ? "/admin/products" : "/seller/products")
    } catch (err) {
      alert("Failed to add product")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const isAdmin = user?.role?.toLowerCase() === "admin"

  const content = (
    <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {isAdmin ? "Admin" : "Seller"} / Add Product
          </div>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Add New Product</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Create a product listing with pricing, stock, and imagery.
          </p>
        </div>
        <Link
          to={isAdmin ? "/admin/products" : "/seller/products"}
          className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Back to products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Product name
              </label>
              <input
                name="name"
                onChange={handleChange}
                value={form.name}
                required
                placeholder="e.g., Cedarwood Beard Oil"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Description
              </label>
              <textarea
                name="description"
                onChange={handleChange}
                value={form.description}
                required
                placeholder="Describe key features, benefits, and materials."
                className="mt-2 h-32 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  onChange={handleChange}
                  value={form.price}
                  required
                  placeholder="Price"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  onChange={handleChange}
                  value={form.quantity}
                  required
                  placeholder="Stock"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Category
              </label>
              <select
                name="categoryId"
                onChange={handleChange}
                value={form.categoryId}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              <div className="font-semibold text-slate-800 dark:text-slate-200">Product image URL</div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                Paste a public image link (optional). You can add S3 uploads later.
              </p>
              <input
                name="imageUrl"
                onChange={handleChange}
                value={form.imageUrl}
                placeholder="https://example.com/product.jpg"
                className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Listing checklist
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>Use a short, specific product name.</li>
                <li>Add key features in the description.</li>
                <li>Verify category and stock before publishing.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            By adding a product, you confirm the information is accurate.
          </p>
          <button
            type="submit"
            disabled={uploading}
            className={`inline-flex min-w-[180px] items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
              uploading
                ? "cursor-not-allowed bg-slate-400"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            }`}
          >
            {uploading ? "Uploading..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  )

  if (embedded) {
    return content
  }

  return isAdmin ? (
    <AdminLayout>
      <div className="py-6">{content}</div>
    </AdminLayout>
  ) : (
    <div className="min-h-screen bg-gray-50 py-10 dark:bg-slate-950">{content}</div>
  )
}
