import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addToWishlist } from "../api/wishlistApi";
import { addWishlistItem } from "../redux/wishlistSlice";
import { getAllProducts } from "../redux/productSlice"
import { addItem } from "../redux/cartSlice"
import { Link } from "react-router-dom"

export default function CustomerHome() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { products, loading, error } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {user && user.role?.toLowerCase() === "customer" && (
        <div className="mb-6 p-4 bg-blue-50 rounded">
          <h2 className="text-xl font-bold text-blue-700">Welcome, {user.name}!</h2>
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Products</h1>
      {loading ? (
        <p className="text-xl animate-pulse text-gray-600">Loading products...</p>
      ) : error ? (
        <p className="text-xl text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="block border rounded p-4 shadow hover:shadow-lg bg-white"
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.imageUrl || "/placeholder.jpg"}
                    alt={product.name || "Product"}
                    className="w-full h-40 object-cover mb-3 rounded"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">{product.name || "Unnamed Product"}</h3>
                  <p className="text-gray-600">{product.categoryName || "Uncategorized"}</p>
                  <p className="text-green-600 font-bold">₹{product.price ?? "N/A"}</p>
                </Link>
                {user && user.role?.toLowerCase() === "customer" && (
                  <>
                    <button
                      onClick={() => {
                        const storedUser = JSON.parse(localStorage.getItem("user"));
                        const userId = storedUser?.id;
                        if (!userId) {
                          alert("You must be logged in to add to cart.");
                          window.location.href = "/login";
                          return;
                        }
                        dispatch(addItem({ userId, productId: product.id, quantity: 1 }));
                      }}
                      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        const storedUser = JSON.parse(localStorage.getItem("user"));
                        const userId = storedUser?.id;
                        if (!userId) {
                          alert("You must be logged in to add to wishlist.");
                          window.location.href = "/login";
                          return;
                        }
                        dispatch(addWishlistItem({ userId, productId: product.id }))
                          .then(() => alert("Added to Wishlist"))
                          .catch((err) => console.error("Wishlist add error", err));

                      }}
                      className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full"
                    >
                      ❤️ Wishlist
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No products found.</p>
          )}
        </div>
      )}
    </div>
  )
}
