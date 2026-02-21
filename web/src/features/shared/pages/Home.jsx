import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addItem } from "../../../redux/cartSlice";
import { getAllProducts } from "../../../redux/productSlice";
import { fetchCategories } from "../../../api/categoryApi";
import ProductFilters from "../../../components/ProductFilters";
import { SearchContext } from "../../../context/SearchContext";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { ToastContext } from "../../../context/ToastContext";

const formatPrice = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.product);
  const { user, token } = useSelector((state) => state.user);
  const { query } = useContext(SearchContext);
  const { showToast } = useContext(ToastContext);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    sort: "",
  });

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getAllProducts({ search: filters.search }));
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, filters.search]);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : data?.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: query }));
  }, [query]);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const applyFilters = () => dispatch(getAllProducts({ ...filters }));

  const resetFilters = () => {
    const empty = { search: "", category: "", minPrice: "", maxPrice: "", minRating: "", sort: "" };
    setFilters(empty);
    dispatch(getAllProducts());
  };

  const topDeals = useMemo(() => (Array.isArray(products) ? products.slice(0, 3) : []), [products]);

  if (loading) return <p className="py-16 text-center text-lg font-semibold text-slate-600 dark:text-slate-300">Loading products...</p>;
  if (error) return <p className="py-16 text-center text-lg font-semibold text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Home" }]} />
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 px-6 py-10 text-white">
        <p className="marketplace-chip mb-3 border-white/30 bg-white/15 text-white">Fresh arrivals</p>
        <h1 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
          Upgrade your cart with trending picks and flash prices.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-blue-50">
          Curated products, better value, fast checkout.
        </p>
      </section>

      {topDeals.length > 0 && (
        <section className="grid gap-4 md:grid-cols-3">
          {topDeals.map((deal) => (
            <Link key={deal.id} to={`/product/${deal.id}`} className="marketplace-panel lift-card p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-orange-600">Top Deal</p>
              <h3 className="mt-1 line-clamp-1 text-base font-bold text-slate-900 dark:text-slate-100">{deal.name}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{deal.categoryName || "General"}</p>
              <p className="mt-3 text-xl font-extrabold text-emerald-600">{formatPrice(deal.price)}</p>
            </Link>
          ))}
        </section>
      )}

      <ProductFilters
        filters={filters}
        categories={categories}
        onChange={updateFilter}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <section>
        <h2 className="mb-4 text-2xl font-extrabold text-slate-900 dark:text-slate-100">All Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="group marketplace-panel lift-card p-4">
                <img
                  src={product.imageUrl || "/placeholder.jpg"}
                  alt={product.name || "Product"}
                  className="h-44 w-full rounded-xl bg-slate-50 object-cover"
                />
                <h3 className="mt-3 line-clamp-1 text-lg font-bold text-slate-900 dark:text-slate-100">{product.name || "Unnamed Product"}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{product.categoryName || "Uncategorized"}</p>
                <p className="mt-2 text-lg font-extrabold text-emerald-600">{formatPrice(product.price)}</p>
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    View
                  </Link>
                  {token && user?.role?.toLowerCase() === "customer" ? (
                    <button
                      onClick={() => {
                        const storedUser = JSON.parse(localStorage.getItem("user"));
                        const userId = storedUser?.id;
                        if (!userId) {
                          showToast("Please login first.", "info");
                          return navigate("/login");
                        }
                        dispatch(addItem({ userId, productId: product.id, quantity: 1 }));
                        showToast("Added to cart.", "success");
                      }}
                      className="primary-cta"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        showToast("Login to continue.", "info");
                        navigate("/login");
                      }}
                      className="accent-cta"
                    >
                      Login to Buy
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">No products found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
