import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllProducts } from "../../../redux/productSlice"
import { Link } from "react-router-dom"
import { deleteProductById } from "../../../api/productApi"
import ProductFilters from "../../../components/ProductFilters"
import { fetchCategories } from "../../../api/categoryApi"
import { SearchContext } from "../../../context/SearchContext"
import AdminLayout from "../../../components/AdminLayout"

export default function AdminProducts() {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.product)
  const { query } = useContext(SearchContext)
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    sort: "",
  })

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {}
      if (filters.search) params.search = filters.search
      if (filters.category) params.category = filters.category
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice
      if (filters.minRating) params.minRating = filters.minRating
      if (filters.sort) params.sort = filters.sort
      dispatch(getAllProducts(params))
    }, 300)
    return () => clearTimeout(timer)
  }, [filters.search, dispatch])

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : data?.data || []))
      .catch(() => setCategories([]))
  }, [])

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: query }))
  }, [query])

  const applyFilters = () => {
    const params = {}
    if (filters.search) params.search = filters.search
    if (filters.category) params.category = filters.category
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.minRating) params.minRating = filters.minRating
    if (filters.sort) params.sort = filters.sort
    dispatch(getAllProducts(params))
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      sort: "",
    })
    dispatch(getAllProducts())
  }

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token") || ""
        await deleteProductById(productId, token)
        applyFilters()
      } catch (err) {
        alert("Failed to delete product")
      }
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
        <span>Products</span>
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Manage Products</h2>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            View and manage all products in the catalog.
          </p>
        </div>
        <Link
          to="/admin/add-product"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Add New Product
        </Link>
      </div>
      <ProductFilters
        filters={filters}
        categories={categories}
        onChange={updateFilter}
        onApply={applyFilters}
        onReset={resetFilters}
      />
      {loading ? (
        <p className="text-xl animate-pulse text-gray-600 dark:text-slate-300">Loading products...</p>
      ) : error ? (
        <p className="text-xl text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="border dark:border-slate-800 rounded-xl p-4 shadow-sm bg-white dark:bg-slate-900">
                <img
                  src={product.imageUrl || "/placeholder.jpg"}
                  alt={product.name || "Product"}
                  className="w-full h-32 object-cover mb-3 rounded-lg bg-gray-50 dark:bg-slate-950"
                />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100">{product.name || "Unnamed Product"}</h3>
                <p className="text-gray-600 dark:text-slate-300">{product.categoryName || "Uncategorized"}</p>
                <p className="text-green-600 font-bold">₹{product.price ?? "N/A"}</p>
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/admin/edit-product/${product.id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500 dark:text-slate-400">No products found.</p>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
