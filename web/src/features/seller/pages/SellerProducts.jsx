import { useSelector } from "react-redux"
import { useContext, useEffect, useState } from "react"
import { fetchProductsBySeller, deleteProductById } from "../../../api/productApi"
import { useNavigate, Link } from "react-router-dom"
import ProductFilters from "../../../components/ProductFilters"
import { fetchCategories } from "../../../api/categoryApi"
import { SearchContext } from "../../../context/SearchContext"
import AdminLayout from "../../../components/AdminLayout"

export default function SellerProducts() {
  const { user, token } = useSelector((state) => state.user)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const { query } = useContext(SearchContext)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    sort: "",
  })
  const navigate = useNavigate()

  const refreshProducts = (params = {}) => {
    if (user?.id && token) {
      fetchProductsBySeller(user.id, params)
        .then(setProducts)
        .catch(console.error)
    }
  }

  useEffect(() => {
    refreshProducts()
  }, [user, token])

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {}
      if (filters.search) params.search = filters.search
      if (filters.category) params.category = filters.category
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice
      if (filters.minRating) params.minRating = filters.minRating
      if (filters.sort) params.sort = filters.sort
      refreshProducts(params)
    }, 300)
    return () => clearTimeout(timer)
  }, [filters.search])

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
    refreshProducts(params)
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
    refreshProducts()
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProductById(id, token)
      applyFilters()
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
        <span>Products</span>
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">My Products</h2>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            Manage products in your catalog.
          </p>
        </div>
        <Link
          to="/seller/add-product"
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

      {products.length === 0 ? (
        <p className="text-gray-600 dark:text-slate-300">No products found. Add some!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="border dark:border-slate-800 rounded-xl p-4 shadow-sm bg-white dark:bg-slate-900"
            >
              <img
                src={p.imageUrl || "/placeholder.jpg"}
                alt={p.name}
                className="h-32 w-full object-cover mb-3 rounded bg-gray-50 dark:bg-slate-950"
              />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100">{p.name}</h3>
              <p className="text-gray-600 dark:text-slate-300">{p.categoryName || "Uncategorized"}</p>
              <p className="text-green-700 dark:text-green-400 font-bold mt-2">Rs. {p.price}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/seller/edit-product/${p.id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
