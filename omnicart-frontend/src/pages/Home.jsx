// src/pages/Home.jsx
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllProducts } from "../redux/productSlice"
import { Link, useNavigate } from "react-router-dom"
import { addItem } from "../redux/cartSlice"

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { products, loading, error } = useSelector((state) => state.product)
  const { user, token } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl animate-pulse text-gray-600">Loading products...</p>
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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="block border rounded p-4 shadow hover:shadow-lg bg-white">
              <img
                src={product.imageUrl || "/placeholder.jpg"}
                alt={product.name || "Product"}
                className="w-full h-40 object-cover mb-3 rounded"
              />
              <h3 className="text-xl font-semibold text-gray-800">{product.name || "Unnamed Product"}</h3>
              <p className="text-gray-600">{product.categoryName || "Uncategorized"}</p>
              <p className="text-green-600 font-bold">₹{product.price ?? "N/A"}</p>
              <Link
                to={`/product/${product.id}`}
                className="mt-2 inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
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
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  )
}
