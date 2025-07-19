import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { createProduct } from "../api/productApi"
import { getPresignedUrl, uploadToS3 } from "../api/s3Api"
import { fetchCategories } from "../api/categoryApi"
import Sidebar from "../components/Sidebar"

export default function AddProduct() {
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.user)

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
  })

  const [categories, setCategories] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories(token)
        setCategories(res)
      } catch (err) {
        console.error("❌ Failed to load categories:", err)
      }
    }
    loadCategories()
  }, [token])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setUploading(true)

      let imageUrl = ""
      if (imageFile) {
        const signedUrl = await getPresignedUrl(imageFile, token)
        await uploadToS3(imageFile, signedUrl)
        imageUrl = signedUrl.split("?")[0]
      }

      await createProduct(
        { ...form, imageUrl, sellerId: user.id },
        token
      )

      alert("✅ Product Added Successfully")
      navigate(user.role.toLowerCase() === "admin" ? "/admin/dashboard" : "/seller/dashboard")
    } catch (err) {
      alert("❌ Failed to add product")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const isAdmin = user?.role?.toLowerCase() === "admin"

  const content = (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white shadow-md rounded-2xl border border-gray-200">
      <div className="flex items-center gap-4 mb-4">
        <Link
          to={isAdmin ? "/admin/dashboard" : "/seller/dashboard"}
          style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 600, fontSize: 18 }}
        >
          &lt; Home
        </Link>
        <h2 className="text-3xl font-bold text-gray-800">Add New Product</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          name="name"
          onChange={handleChange}
          value={form.name}
          required
          placeholder="Product Name"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description"
          onChange={handleChange}
          value={form.description}
          required
          placeholder="Product Description"
          className="w-full px-4 py-3 border rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            onChange={handleChange}
            value={form.price}
            required
            placeholder="Price (₹)"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="quantity"
            onChange={handleChange}
            value={form.quantity}
            required
            placeholder="Quantity"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-gray-50"
        />

        <select
          name="categoryId"
          onChange={handleChange}
          value={form.categoryId}
          required
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 text-white rounded-lg transition duration-200 ${
            uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  )

  return isAdmin ? (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">{content}</div>
    </div>
  ) : content
}
