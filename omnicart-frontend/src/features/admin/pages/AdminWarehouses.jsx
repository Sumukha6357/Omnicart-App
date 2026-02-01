import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../../components/AdminLayout"
import { createWarehouse, deleteWarehouse, fetchWarehouses, updateWarehouse } from "../../../api/warehouseApi"

export default function AdminWarehouses() {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", location: "", capacity: "" })
  const [editingId, setEditingId] = useState(null)

  const loadWarehouses = async () => {
    try {
      setLoading(true)
      const data = await fetchWarehouses()
      setWarehouses(Array.isArray(data) ? data : [])
      setError("")
    } catch (err) {
      setError("Failed to load warehouses.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWarehouses()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      alert("Warehouse name is required")
      return
    }
    await createWarehouse({
      name: form.name.trim(),
      location: form.location?.trim() || null,
      capacity: form.capacity ? Number(form.capacity) : null,
      active: true,
    })
    setForm({ name: "", location: "", capacity: "" })
    loadWarehouses()
  }

  const startEdit = (warehouse) => {
    setEditingId(warehouse.id)
    setForm({
      name: warehouse.name || "",
      location: warehouse.location || "",
      capacity: warehouse.capacity ?? "",
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ name: "", location: "", capacity: "" })
  }

  const saveEdit = async (warehouseId) => {
    await updateWarehouse(warehouseId, {
      name: form.name.trim(),
      location: form.location?.trim() || null,
      capacity: form.capacity ? Number(form.capacity) : null,
    })
    cancelEdit()
    loadWarehouses()
  }

  const removeWarehouse = async (warehouseId) => {
    if (!confirm("Delete this warehouse?")) return
    await deleteWarehouse(warehouseId)
    loadWarehouses()
  }

  return (
    <AdminLayout>
      <div className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        <Link
          to="/admin/dashboard"
          className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          Admin
        </Link>
        <span className="mx-2">/</span>
        <span>Warehouses</span>
      </div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Manage Warehouses</h2>
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Create and update warehouse locations used for inventory.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Warehouse name"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
          <input
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            type="number"
            min="0"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 md:col-span-3"
          >
            Add Warehouse
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-slate-300">Loading warehouses...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
              <tr>
                <th className="px-4 py-3 border-b dark:border-slate-800">Name</th>
                <th className="px-4 py-3 border-b dark:border-slate-800">Location</th>
                <th className="px-4 py-3 border-b dark:border-slate-800">Capacity</th>
                <th className="px-4 py-3 border-b dark:border-slate-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 border-b dark:border-slate-800">
                    {editingId === warehouse.id ? (
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                      />
                    ) : (
                      warehouse.name
                    )}
                  </td>
                  <td className="px-4 py-3 border-b dark:border-slate-800">
                    {editingId === warehouse.id ? (
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                      />
                    ) : (
                      warehouse.location || "—"
                    )}
                  </td>
                  <td className="px-4 py-3 border-b dark:border-slate-800">
                    {editingId === warehouse.id ? (
                      <input
                        name="capacity"
                        value={form.capacity}
                        onChange={handleChange}
                        type="number"
                        min="0"
                        className="w-full rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                      />
                    ) : (
                      warehouse.capacity ?? "—"
                    )}
                  </td>
                  <td className="px-4 py-3 border-b dark:border-slate-800 text-right">
                    {editingId === warehouse.id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => saveEdit(warehouse.id)}
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
                          onClick={() => startEdit(warehouse)}
                          className="rounded bg-slate-900 px-3 py-1 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeWarehouse(warehouse.id)}
                          className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {warehouses.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-slate-400 dark:text-slate-500">
                    No warehouses yet.
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
