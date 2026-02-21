// src/pages/Home.jsx
import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllProducts } from "../../../redux/productSlice"
import { Link, useNavigate } from "react-router-dom"
import { addItem } from "../../../redux/cartSlice"
import ProductFilters from "../../../components/ProductFilters"
import { fetchCategories } from "../../../api/categoryApi"
import { SearchContext } from "../../../context/SearchContext"

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { products, loading, error } = useSelector((state) => state.product)
  const { user, token } = useSelector((state) => state.user)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl animate-pulse text-gray-600 dark:text-slate-300">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">All Products</h1>
      </div>
      <ProductFilters
        filters={filters}
        categories={categories}
        onChange={updateFilter}
        onApply={applyFilters}
        onReset={resetFilters}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="block border dark:border-slate-700 rounded p-4 shadow hover:shadow-lg bg-white dark:bg-slate-900">
              <img
                src={product.imageUrl || "/placeholder.jpg"}
                alt={product.name || "Product"}
                className="w-full h-40 object-cover mb-3 rounded"
              />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100">{product.name || "Unnamed Product"}</h3>
              <p className="text-gray-600 dark:text-slate-300">{product.categoryName || "Uncategorized"}</p>
              <p className="text-green-600 font-bold">₹{product.price ?? "N/A"}</p>
              <Link
                to={`/product/${product.id}`}
                className="mt-2 inline-block bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-slate-100 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-slate-700"
              >
                View Details
              </Link>
              {token && user?.role?.toLowerCase() === "customer" ? (
                <button
                  onClick={() => {
                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    const userId = storedUser?.id;
                    if (!userId) {
                      alert('You must be logged in to add to cart.');
                      navigate('/login');
                      return;
                    }
                    dispatch(addItem({ userId, productId: product.id, quantity: 1 }));
                  }}
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Login to Add to Cart
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 dark:text-slate-400">No products found.</p>
        )}
      </div>
    </div>
  )
}




