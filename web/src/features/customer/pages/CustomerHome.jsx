import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addWishlistItem, fetchWishlist } from "../../../redux/wishlistSlice";
import { getAllProducts } from "../../../redux/productSlice";
import { addItem, fetchCart } from "../../../redux/cartSlice";
import { fetchCategories } from "../../../api/categoryApi";
import { SearchContext } from "../../../context/SearchContext";
import { ToastContext } from "../../../context/ToastContext";
import Breadcrumbs from "../../../components/Breadcrumbs";
import FilterBar from "../../../components/customer/FilterBar";
import ProductGrid from "../../../components/customer/ProductGrid";
import ProductGridSkeleton from "../../../components/customer/ProductGridSkeleton";
import EmptyState from "../../../components/customer/EmptyState";
import ErrorState from "../../../components/customer/ErrorState";

export default function CustomerHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { products, loading, error } = useSelector((state) => state.product);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { query } = useContext(SearchContext);
  const { showToast } = useContext(ToastContext);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    sort: "",
  });
  const [cartLoadingById, setCartLoadingById] = useState({});
  const [wishlistLoadingById, setWishlistLoadingById] = useState({});

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getAllProducts({ search: filters.search }));
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search, dispatch]);

  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : data?.data || []);
      } catch {
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: query }));
  }, [query]);

  const wishlistSet = useMemo(
    () => new Set((wishlistItems || []).map((i) => String(i.productId))),
    [wishlistItems]
  );

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    dispatch(getAllProducts({ ...filters }));
  };

  const resetFilters = () => {
    const empty = {
      search: query || "",
      category: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      sort: "",
    };
    setFilters(empty);
    dispatch(getAllProducts({ search: empty.search }));
    showToast("Filters reset.", "info");
  };

  const handleToggleWishlist = async (product) => {
    const productId = String(product.id);
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const userId = storedUser?.id;

    if (!userId) {
      showToast("Please login first.", "info");
      navigate("/login");
      return;
    }

    try {
      setWishlistLoadingById((prev) => ({ ...prev, [productId]: true }));
      await dispatch(addWishlistItem({ userId, productId }));
      await dispatch(fetchWishlist(userId));
      showToast("Wishlist updated.", "success");
    } catch {
      showToast("Failed to update wishlist.", "error");
    } finally {
      setWishlistLoadingById((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToCart = async (product) => {
    const productId = String(product.id);
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const userId = storedUser?.id;

    if (!userId) {
      showToast("Please login first.", "info");
      navigate("/login");
      return;
    }

    try {
      setCartLoadingById((prev) => ({ ...prev, [productId]: true }));
      await dispatch(addItem({ userId, productId, quantity: 1 }));
      await dispatch(fetchCart({ userId }));
      showToast("Added to cart.", "success");
    } catch {
      showToast("Failed to add item.", "error");
    } finally {
      setCartLoadingById((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleBuyNow = (product) => {
    showToast("Proceeding to checkout.", "info");
    navigate(`/checkout?buyNow=1&productId=${product.id}&quantity=1`);
  };

  const handleRetry = () => {
    dispatch(getAllProducts({ ...filters }));
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Customer" }]} />

      <section className="rounded-card border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Customer Zone</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Shop curated picks</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Welcome back{user?.name ? `, ${user.name}` : ""}. Fast delivery and better prices.
            </p>
          </div>
          <Link
            to="/orders"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            View Orders
          </Link>
        </div>
      </section>

      <FilterBar
        filters={filters}
        categories={categories}
        categoriesLoading={categoriesLoading}
        onChange={updateFilter}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      {loading ? (
        <ProductGridSkeleton count={10} />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : Array.isArray(products) && products.length > 0 ? (
        <ProductGrid
          products={products}
          wishlistSet={wishlistSet}
          cartLoadingById={cartLoadingById}
          wishlistLoadingById={wishlistLoadingById}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      ) : (
        <EmptyState onReset={resetFilters} />
      )}
    </div>
  );
}
