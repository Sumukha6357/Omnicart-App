import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { createCategory, fetchCategories, updateCategory } from "../../../api/categoryApi"
import AdminLayout from "../../../components/AdminLayout"

export default function AddCategory() {
  const { token } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const queryId = useMemo(() => new URLSearchParams(location.search).get("id"), [location.search])

  const [form, setForm] = useState({ name: "", description: "" })
  const [loading, setLoading] = useState(false)
  const [loadingCategory, setLoadingCategory] = useState(false)

  useEffect(() => {
    if (!queryId) return
    const loadCategory = async () => {
      try {
        setLoadingCategory(true)
        const data = await fetchCategories(token)
        const items = Array.isArray(data) ? data : data?.data || []
        const match = items.find((cat) => String(cat.id) === String(queryId))
        if (match) {
          setForm({ name: match.name || "", description: match.description || "" })
        }
      } catch (err) {
        console.error("Failed to load category:", err)
      } finally {
        setLoadingCategory(false)
      }
    }
    loadCategory()
  }, [queryId, token])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (queryId) {
        await updateCategory(queryId, form, token)
      } else {
        await createCategory(form, token)
      }
      alert(queryId ? "Category updated" : "Category added")
      navigate("/admin/categories")
    } catch (err) {
      alert("Failed to save category")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {queryId ? "Edit Category" : "Add Category"}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Keep categories clear and concise for better product discovery.
              </p>
            </div>
            <Link
              to="/admin/categories"
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Back to categories
            </Link>
          </div>

          {loadingCategory ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading category...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Category name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Grooming Essentials"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe what this category includes."
                  className="mt-2 h-28 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Categories help shoppers browse products faster.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex min-w-[180px] items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
                    loading
                      ? "cursor-not-allowed bg-slate-400"
                      : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                  }`}
                >
                  {loading ? "Saving..." : queryId ? "Update Category" : "Add Category"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
