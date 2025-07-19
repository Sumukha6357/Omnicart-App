import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { addToWishlist } from "../api/wishlistApi"
import { addWishlistItem } from "../redux/wishlistSlice";
import { getProductById } from "../redux/productSlice"
import { addItem, fetchCart } from "../redux/cartSlice"
import { Heart } from "lucide-react" // or use a custom icon

export default function ProductDetail({ addToCart }) {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { product, loading } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(getProductById(id))
  }, [id])

  if (loading || !product)
    return <p className="text-center mt-10">Loading product...</p>

  const handleAddToWishlist = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user?.id
    if (!userId) {
      alert("You must be logged in to add to wishlist.")
      return
    }
    dispatch(addWishlistItem({ userId, productId: product.id }))
  .then(() => alert("Added to Wishlist"))
  .catch((err) => console.error("Wishlist add error", err));

  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded shadow-md">
      <button
        onClick={() => window.location.href = "/"}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-bold"
      >
        <span className="text-2xl mr-1">&#60;</span> Home
      </button>
      <div className="flex gap-6 relative">
        {/* Product Image with Wishlist Button */}
        <div className="relative w-1/2">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto object-contain"
          />
          <button
            onClick={handleAddToWishlist}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600"
            title="Add to Wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <p className="text-green-600 text-2xl font-semibold mb-4">
            ₹{product.price}
          </p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => {
                const user = JSON.parse(localStorage.getItem("user"))
                const userId = user?.id
                if (!userId) {
                  alert("You must be logged in to add to cart.")
                  return
                }
                dispatch(addItem({ userId, productId: product.id, quantity: 1 }))
                  .then(() => dispatch(fetchCart({ userId })))
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                const user = JSON.parse(localStorage.getItem("user"))
                const userId = user?.id
                if (!userId) {
                  alert("You must be logged in to buy.")
                  return
                }
                // Direct buy: go to checkout with product details in state
                window.location.href = `/checkout?buyNow=1&productId=${product.id}&quantity=1`;
              }}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
