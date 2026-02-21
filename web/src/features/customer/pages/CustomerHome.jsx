import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addWishlistItem, fetchWishlist } from "../../../redux/wishlistSlice";
import { getAllProducts } from "../../../redux/productSlice";
import { addItem, fetchCart } from "../../../redux/cartSlice";
import { fetchCategories } from "../../../api/categoryApi";
import { getEnabledAds } from "../../../api/adsApi";
import { SearchContext } from "../../../context/SearchContext";
import { ToastContext } from "../../../context/ToastContext";
import Breadcrumbs from "../../../components/Breadcrumbs";
import FilterBar from "../../../components/customer/FilterBar";
import ProductGrid from "../../../components/customer/ProductGrid";
import ProductGridSkeleton from "../../../components/customer/ProductGridSkeleton";
import EmptyState from "../../../components/customer/EmptyState";
import ErrorState from "../../../components/customer/ErrorState";
import CategoryBanners from "../../../components/customer/CategoryBanners";
import PromoAdsStrip from "../../../components/customer/PromoAdsStrip";
import HeroCarousel from "../../../components/customer/HeroCarousel";
import DealWidgets from "../../../components/customer/DealWidgets";
import CategoryProductRows from "../../../components/customer/CategoryProductRows";
import { getRoleHomePath } from "../../../utils/navigation";

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
  const [ads, setAds] = useState([]);
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
  const [showTopSections, setShowTopSections] = useState(true);
  const lastScrollY = useRef(0);

  const homePath = getRoleHomePath(user?.role);
  const isSearchMode = Boolean((filters.search || "").trim());
  const hasActiveRefiners = Boolean(
    filters.category || filters.minPrice || filters.maxPrice || filters.minRating || filters.sort
  );
  const showFilterBar = isSearchMode || hasActiveRefiners;

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
    const loadAds = async () => {
      const list = await getEnabledAds();
      setAds(Array.isArray(list) ? list : []);
    };
    loadAds();
  }, []);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: query }));
  }, [query]);

  useEffect(() => {
    const preferredCategory = localStorage.getItem("omnicart_pref_category");
    const preferredSort = localStorage.getItem("omnicart_pref_sort");
    if (!preferredCategory && !preferredSort) return;

    setFilters((prev) => {
      const nextFilters = {
        ...prev,
        search: "",
        category: preferredCategory || "",
        sort: preferredSort || "",
      };
      dispatch(getAllProducts(nextFilters));
      return nextFilters;
    });
    localStorage.removeItem("omnicart_pref_category");
    localStorage.removeItem("omnicart_pref_sort");
  }, [dispatch]);

  useEffect(() => {
    if (isSearchMode) {
      setShowTopSections(false);
      return;
    }

    const onScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;
      if (currentY < 80) {
        setShowTopSections(true);
      } else if (scrollingDown && currentY > 160) {
        setShowTopSections(false);
      } else if (!scrollingDown) {
        setShowTopSections(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isSearchMode]);

  const wishlistSet = useMemo(
    () => new Set((wishlistItems || []).map((i) => String(i.productId))),
    [wishlistItems]
  );

  const recentlyViewedProducts = useMemo(() => {
    try {
      const raw = localStorage.getItem("omnicart_recently_viewed");
      const ids = raw ? JSON.parse(raw) : [];
      const byId = new Map((products || []).map((p) => [String(p.id), p]));
      return ids.map((id) => byId.get(String(id))).filter(Boolean).slice(0, 10);
    } catch {
      return [];
    }
  }, [products]);

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

  const handlePickCategory = (category) => {
    const nextFilters = { ...filters, category, search: "" };
    setFilters(nextFilters);
    dispatch(getAllProducts(nextFilters));
    showToast(`Showing ${category} deals.`, "info");
  };

  const handleAdClick = (ad) => {
    if (ad?.category) {
      const nextFilters = { ...filters, category: ad.category, search: "" };
      setFilters(nextFilters);
      dispatch(getAllProducts(nextFilters));
      showToast(`Showing ${ad.category} offers.`, "info");
      return;
    }
    if (ad?.ctaLink) {
      navigate(ad.ctaLink);
    }
  };

  const deliveryLocation = localStorage.getItem("omnicart_location") || "Bengaluru 562130";

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
      <Breadcrumbs items={[{ label: "Home", to: homePath }, { label: "Customer" }]} />

      {!isSearchMode ? (
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
      ) : (
        <section className="rounded-card border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Results for "{filters.search}"</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{Array.isArray(products) ? products.length : 0} products found</p>
        </section>
      )}

      {!isSearchMode && showTopSections && (
        <HeroCarousel ads={ads} onSlideAction={handleAdClick} locationLabel={deliveryLocation} />
      )}
      {!isSearchMode && showTopSections && <DealWidgets products={products} />}
      {!isSearchMode && showTopSections && <PromoAdsStrip ads={ads} onAdClick={handleAdClick} />}
      {!isSearchMode && showTopSections && <CategoryBanners onPickCategory={handlePickCategory} />}
      {!isSearchMode && showTopSections && (
        <CategoryProductRows products={products} onCategoryPick={handlePickCategory} />
      )}
      {!isSearchMode && showTopSections && recentlyViewedProducts.length > 0 && (
        <section className="rounded-card border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-slate-100">Continue Shopping</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {recentlyViewedProducts.map((product) => (
              <Link
                key={`rv-${product.id}`}
                to={`/product/${product.id}`}
                className="min-w-[170px] rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <img src={product.imageUrl || "/placeholder.jpg"} alt={product.name} className="h-24 w-full rounded-lg bg-slate-100 object-cover dark:bg-slate-950" />
                <p className="mt-2 line-clamp-2 text-xs font-semibold text-slate-700 dark:text-slate-200">{product.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {showFilterBar && (
        <FilterBar
          filters={filters}
          categories={categories}
          categoriesLoading={categoriesLoading}
          onChange={updateFilter}
          onApply={applyFilters}
          onReset={resetFilters}
          compact
          resultCount={Array.isArray(products) ? products.length : 0}
        />
      )}

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
