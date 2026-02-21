import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../../components/AdminLayout"
import {
  fetchSellerWarehouseInventoryByWarehouse,
  adjustInventory,
  deleteWarehouseInventory,
} from "../../../api/inventoryApi"
import { fetchWarehouses } from "../../../api/warehouseApi"
import { fetchCategories } from "../../../api/categoryApi"

export default function SellerInventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [draftQty, setDraftQty] = useState("")
  const [draftReason, setDraftReason] = useState("")
  const [saving, setSaving] = useState(false)
  const [warehouses, setWarehouses] = useState([])
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("")
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showAddStock, setShowAddStock] = useState(false)
  const [stockForm, setStockForm] = useState({
    productId: "",
    quantity: "",
    type: "INBOUND",
    reason: "",
  })

  const userStr = localStorage.getItem("user")
  const sellerId = userStr ? JSON.parse(userStr)?.id : null

  const loadInventory = async () => {
    try {
      setLoading(true)
      const data = selectedWarehouseId
        ? await fetchSellerWarehouseInventoryByWarehouse(sellerId, selectedWarehouseId)
        : []
      setItems(Array.isArray(data) ? data : [])
      setError("")
    } catch (err) {
      setError("Failed to load inventory.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const data = await fetchWarehouses()
        const list = Array.isArray(data) ? data : []
        setWarehouses(list)
        if (!selectedWarehouseId && list.length > 0) {
          setSelectedWarehouseId(list[0].id)
        }
      } catch (err) {
        setWarehouses([])
      }
    }
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        const list = Array.isArray(data) ? data : []
        setCategories(list)
      } catch (err) {
        setCategories([])
      }
    }
    loadWarehouses()
    loadCategories()
  }, [])

  useEffect(() => {
    if (sellerId) {
      loadInventory()
    }
  }, [sellerId, selectedWarehouseId])

  const startEdit = (item) => {
    setEditingId(item.productId)
    setDraftQty(String(item.quantity ?? 0))
    setDraftReason("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraftQty("")
    setDraftReason("")
  }

  const saveEdit = async (item) => {
    const nextQty = Number(draftQty)
    if (Number.isNaN(nextQty) || nextQty < 0) {
      alert("Quantity must be a non-negative number")
      return
    }
    try {
      setSaving(true)
      const delta = nextQty - (item.quantity ?? 0)
      if (delta !== 0) {
        await adjustInventory({
          warehouseId: item.warehouseId || selectedWarehouseId,
          productId: item.productId,
          quantityDelta: delta,
          type: "ADJUSTMENT",
          reason: draftReason || "Manual adjustment",
        })
      }
      await loadInventory()
      cancelEdit()
    } catch (err) {
      alert("Failed to update inventory")
    } finally {
      setSaving(false)
    }
  }

  const resetStockForm = () => {
    setStockForm({ productId: "", quantity: "", type: "INBOUND", reason: "" })
    setSelectedCategory("")
  }

  const submitAddStock = async (e) => {
    e.preventDefault()
    if (!stockForm.productId) {
      alert("Select a product")
      return
    }
    const qty = Number(stockForm.quantity)
    if (Number.isNaN(qty) || qty <= 0) {
      alert("Quantity must be greater than 0")
      return
    }
    try {
      setSaving(true)
      await adjustInventory({
        warehouseId: selectedWarehouseId,
        productId: stockForm.productId,
        quantityDelta: stockForm.type === "OUTBOUND" ? -qty : qty,
        type: stockForm.type,
        reason: stockForm.reason || "Manual stock update",
      })
      await loadInventory()
      resetStockForm()
      setShowAddStock(false)
    } catch (err) {
      alert("Failed to add stock")
    } finally {
      setSaving(false)
    }
  }

  const deleteStock = async (item) => {
    const warehouseId = item.warehouseId || selectedWarehouseId
    if (!warehouseId || !item?.productId) {
      return
    }
    const confirmDelete = window.confirm("Delete inventory for this product in the selected warehouse?")
    if (!confirmDelete) {
      return
    }
    try {
      setSaving(true)
      await deleteWarehouseInventory(warehouseId, item.productId)
      await loadInventory()
      if (editingId === item.productId) {
        cancelEdit()
      }
    } catch (err) {
      alert("Failed to delete inventory")
    } finally {
      setSaving(false)
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
        <span>Inventory</span>
      </div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Inventory</h2>
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Manage stock levels for your products.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Warehouse</label>
          <select
            value={selectedWarehouseId}
            onChange={(e) => setSelectedWarehouseId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowAddStock(true)}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add Inventory
        </button>
      </div>

      {showAddStock && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add Inventory</h3>
            <button
              onClick={() => {
                setShowAddStock(false)
                resetStockForm()
              }}
              className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              Close
            </button>
          </div>
          <form onSubmit={submitAddStock} className="grid gap-4 md:grid-cols-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={stockForm.productId}
              onChange={(e) => setStockForm({ ...stockForm, productId: e.target.value })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="">Select product</option>
              {items
                .filter((item) => !selectedCategory || item.categoryName === selectedCategory)
                .map((item) => (
                  <option key={item.productId} value={item.productId}>
                    {item.productName || "Unnamed Product"}
                  </option>
                ))}
            </select>
            <input
              type="number"
              min="1"
              value={stockForm.quantity}
              onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
              placeholder="Quantity"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            />
            <select
              value={stockForm.type}
              onChange={(e) => setStockForm({ ...stockForm, type: e.target.value })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="INBOUND">Inbound</option>
              <option value="ADJUSTMENT">Adjustment</option>
              <option value="OUTBOUND">Outbound</option>
            </select>
            <input
              value={stockForm.reason}
              onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
              placeholder="Reason (optional)"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 md:col-span-4"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white md:col-span-4"
            >
              Add Stock
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600 dark:text-slate-300">Loading inventory...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-slate-950 text-gray-700 dark:text-slate-200">
              <tr>
                <th className="px-4 py-3 border-b dark:border-slate-800">Product</th>
                <th className="px-4 py-3 border-b dark:border-slate-800">Category</th>
                <th className="px-4 py-3 border-b dark:border-slate-800">Quantity</th>
                <th className="px-4 py-3 border-b dark:border-slate-800">Last Updated</th>
                <th className="px-4 py-3 border-b dark:border-slate-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isEditing = editingId === item.productId
                return (
                  <tr key={item.productId} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="px-4 py-3 border-b dark:border-slate-800">
                      {item.productName || "Unnamed Product"}
                    </td>
                    <td className="px-4 py-3 border-b dark:border-slate-800">
                      {item.categoryName || "Uncategorized"}
                    </td>
                    <td className="px-4 py-3 border-b dark:border-slate-800">
                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <input
                            type="number"
                            min="0"
                            value={draftQty}
                            onChange={(e) => setDraftQty(e.target.value)}
                            className="w-24 rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                          />
                          <input
                            value={draftReason}
                            onChange={(e) => setDraftReason(e.target.value)}
                            placeholder="Reason (optional)"
                            className="w-48 rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                          />
                        </div>
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className="px-4 py-3 border-b dark:border-slate-800">
                      {item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3 border-b dark:border-slate-800 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => saveEdit(item)}
                            disabled={saving}
                            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="rounded bg-gray-200 px-3 py-1 text-slate-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="rounded bg-slate-900 px-3 py-1 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteStock(item)}
                            disabled={saving}
                            className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400 dark:text-slate-500">
                    No inventory records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
