import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import { createAd, deleteAd, getAllAds, updateAd } from "../../../api/adsApi";

const emptyForm = {
  title: "",
  subtitle: "",
  imageUrl: "",
  category: "",
  ctaText: "",
  ctaLink: "/customer/home",
  enabled: true,
};

export default function AdminAds() {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAds = async () => {
    setLoading(true);
    const list = await getAllAds();
    setAds(Array.isArray(list) ? list : []);
    setLoading(false);
  };

  useEffect(() => {
    loadAds();
  }, []);

  const stats = useMemo(() => {
    const total = ads.length;
    const enabled = ads.filter((ad) => ad.enabled !== false).length;
    return { total, enabled, disabled: total - enabled };
  }, [ads]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingId) {
      await updateAd(editingId, form);
    } else {
      await createAd(form);
    }

    setForm(emptyForm);
    setEditingId(null);
    loadAds();
  };

  const handleEdit = (ad) => {
    setEditingId(ad.id);
    setForm({
      title: ad.title || "",
      subtitle: ad.subtitle || "",
      imageUrl: ad.imageUrl || "",
      category: ad.category || "",
      ctaText: ad.ctaText || "",
      ctaLink: ad.ctaLink || "/customer/home",
      enabled: ad.enabled !== false,
    });
  };

  const handleToggle = async (ad) => {
    await updateAd(ad.id, { enabled: !(ad.enabled !== false) });
    loadAds();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ad?")) return;
    await deleteAd(id);
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
    loadAds();
  };

  return (
    <AdminLayout>
      <div className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        <Link to="/admin/dashboard" className="font-medium hover:text-slate-900 dark:hover:text-white">
          Admin
        </Link>
        <span className="mx-2">/</span>
        <span>Ads</span>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Ad Manager</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Create homepage banners and promo strips for customer storefront.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs dark:border-slate-800 dark:bg-slate-900">
          <p>Total: <span className="font-bold">{stats.total}</span></p>
          <p>Enabled: <span className="font-bold text-emerald-600">{stats.enabled}</span></p>
          <p>Disabled: <span className="font-bold text-amber-600">{stats.disabled}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2">
        <input
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Ad title"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          required
        />
        <input
          value={form.subtitle}
          onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
          placeholder="Ad subtitle"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          value={form.imageUrl}
          onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="Image URL"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 md:col-span-2"
        />
        <input
          value={form.category}
          onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          placeholder="Target category (optional)"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          value={form.ctaText}
          onChange={(e) => setForm((prev) => ({ ...prev, ctaText: e.target.value }))}
          placeholder="CTA text"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          value={form.ctaLink}
          onChange={(e) => setForm((prev) => ({ ...prev, ctaLink: e.target.value }))}
          placeholder="CTA link"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))}
          />
          Enabled
        </label>
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            {editingId ? "Update Ad" : "Create Ad"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-slate-600 dark:text-slate-300">Loading ads...</p>
      ) : (
        <div className="space-y-3">
          {ads.map((ad) => (
            <article key={ad.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{ad.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{ad.subtitle}</p>
                  <p className="mt-1 text-xs text-slate-500">Category: {ad.category || "All"}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(ad)} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">Edit</button>
                  <button onClick={() => handleToggle(ad)} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600">
                    {ad.enabled !== false ? "Disable" : "Enable"}
                  </button>
                  <button onClick={() => handleDelete(ad.id)} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
