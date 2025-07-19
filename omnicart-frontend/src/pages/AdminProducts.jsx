import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllProducts } from "../redux/productSlice"
import Sidebar from "../components/Sidebar"
import { Link } from "react-router-dom"
import { deleteProductById } from "../api/productApi"

export default function AdminProducts() {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  const handleDelete = async (productId) => {
    console.log("Deleting product with ID:", productId) // Add this line
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token") || ""
        await deleteProductById(productId, token)
        dispatch(getAllProducts())
      } catch (err) {
        console.error("Delete error:", err) // Add this line
        alert("Failed to delete product")
      }
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 bg-gray-100 min-h-screen p-6">
        <h2 className="text-3xl font-bold mb-6">📦 Manage Products</h2>
        {loading ? (
          <p className="text-xl animate-pulse text-gray-600">Loading products...</p>
        ) : error ? (
          <p className="text-xl text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="border rounded p-4 shadow bg-white">
                  <img
                    src={product.imageUrl || "/placeholder.jpg"}
                    alt={product.name || "Product"}
                    className="w-full h-32 object-cover mb-3 rounded"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">{product.name || "Unnamed Product"}</h3>
                  <p className="text-gray-600">{product.categoryName || "Uncategorized"}</p>
                  <p className="text-green-600 font-bold">₹{product.price ?? "N/A"}</p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/admin/edit-product/${product.id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">No products found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}