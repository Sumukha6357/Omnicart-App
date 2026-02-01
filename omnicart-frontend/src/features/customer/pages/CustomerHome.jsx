import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addWishlistItem } from "../../../redux/wishlistSlice"
import { getAllProducts } from "../../../redux/productSlice"
import { addItem } from "../../../redux/cartSlice"
import { Link, useNavigate } from "react-router-dom"
import { Heart } from "lucide-react"
import ProductFilters from "../../../components/ProductFilters"
import { fetchCategories } from "../../../api/categoryApi"
import { SearchContext } from "../../../context/SearchContext"

export default function CustomerHome() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const { products, loading, error } = useSelector((state) => state.product)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 px-6 py-10">
      <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        <Link to="/customer/home" className="hover:text-blue-600">Customer</Link>
        <span className="mx-2">/</span>
        <span>Home</span>
      </div>
      {user && user.role?.toLowerCase() === "customer" && (
        <div className="mb-6 p-4 bg-blue-50 rounded">
          <h2 className="text-xl font-bold text-blue-700">Welcome, {user.name}!</h2>
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-4">All Products</h1>
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
              <div
                key={product.id}
                className="block border dark:border-slate-700 rounded p-4 shadow hover:shadow-lg bg-white dark:bg-slate-900"
              >
                <div className="relative">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.imageUrl || "/placeholder.jpg"}
                      alt={product.name || "Product"}
                      className="w-full h-40 object-cover mb-3 rounded"
                    />
                  </Link>
                  {user && user.role?.toLowerCase() === "customer" && (
                    <button
                      onClick={() => {
                        const storedUser = JSON.parse(localStorage.getItem("user"))
                        const userId = storedUser?.id
                        if (!userId) {
                          alert("You must be logged in to add to wishlist.")
                          window.location.href = "/login"
                          return
                        }
                        dispatch(addWishlistItem({ userId, productId: product.id }))
                      }}
                      className={`absolute top-2 right-2 p-2 shadow transition ${
                        wishlistItems?.some((i) => String(i.productId) === String(product.id))
                          ? "bg-red-500 text-white rounded-full ring-2 ring-red-200 scale-105"
                          : "bg-white dark:bg-slate-900 border dark:border-slate-700 text-red-500 rounded-full"
                      }`}
                      title="Add to Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlistItems?.some((i) => String(i.productId) === String(product.id))
                            ? "text-white fill-white"
                            : "text-red-500"
                        }`}
                      />
                    </button>
                  )}
                </div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100">{product.name || "Unnamed Product"}</h3>
                  <p className="text-gray-600 dark:text-slate-300">{product.categoryName || "Uncategorized"}</p>
                  <p className="text-green-600 font-bold">Rs. {product.price ?? "N/A"}</p>
                </Link>
                {user && user.role?.toLowerCase() === "customer" && (
                  <>
                    <button
                      onClick={() => {
                        const storedUser = JSON.parse(localStorage.getItem("user"))
                        const userId = storedUser?.id
                        if (!userId) {
                          alert("You must be logged in to add to cart.")
                          window.location.href = "/login"
                          return
                        }
                        dispatch(addItem({ userId, productId: product.id, quantity: 1 }))
                      }}
                      className="mt-3 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 w-full"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        navigate(`/checkout?buyNow=1&productId=${product.id}&quantity=1`)
                      }}
                      className="mt-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 w-full"
                    >
                      Buy Now
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500 dark:text-slate-400">No products found.</p>
          )}
        </div>
      )}
    </div>
  )
}

