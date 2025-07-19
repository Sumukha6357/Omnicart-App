// src/pages/SellerProducts.jsx
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { fetchProductsBySeller, deleteProductById } from "../api/productApi"
import { useNavigate, Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"

export default function SellerProducts() {
  const { user, token } = useSelector((state) => state.user)
  const [products, setProducts] = useState([])
  const navigate = useNavigate();

  const refreshProducts = () => {
    if (user?.id && token) {
      fetchProductsBySeller(user.id, token)
        .then(setProducts)
        .catch(console.error)
    }
  };

  useEffect(() => {
    refreshProducts();
    // eslint-disable-next-line
  }, [user, token])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProductById(id, token);
      refreshProducts();
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full min-h-screen p-6 bg-gray-50">
        <div className="mb-4">
          <Link to="/seller/dashboard" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 600, fontSize: 18 }}>&lt; Home</Link>
        </div>
        <h2 className="text-2xl font-bold mb-6">📦 My Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-600">No products found. Add some!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="border p-4 rounded shadow bg-white">
                <img src={p.imageUrl} alt={p.name} className="h-32 w-full object-cover mb-3 rounded" />
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="text-gray-600">{p.categoryName}</p>
                <p className="text-green-700 font-bold mt-2">₹{p.price}</p>
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
      </div>
    </div>
  )
}
