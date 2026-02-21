import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { addWishlistItem } from "../../../redux/wishlistSlice";
import { getAllProducts } from "../../../redux/productSlice";
import { addItem } from "../../../redux/cartSlice";
import { fetchCategories } from "../../../api/categoryApi";
import ProductFilters from "../../../components/ProductFilters";
import { SearchContext } from "../../../context/SearchContext";

const formatPrice = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

export default function CustomerHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { products, loading, error } = useSelector((state) => state.product);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { query } = useContext(SearchContext);
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
  }, [filters.search, dispatch]);

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

  return (
    <div className="space-y-6">
      <div className="marketplace-panel flex items-center justify-between p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Customer Zone</p>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Welcome back{user?.name ? `, ${user.name}` : ""}.
          </h1>
          <p className="mt-1 text-sm text-slate-600">Your feed is tuned for quick reorders and new arrivals.</p>
        </div>
        <Link to="/orders" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">
          View Orders
        </Link>
      </div>

      <ProductFilters
        filters={filters}
        categories={categories}
        onChange={updateFilter}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      {loading ? (
        <p className="py-12 text-center text-lg font-semibold text-slate-600">Loading products...</p>
      ) : error ? (
        <p className="py-12 text-center text-lg font-semibold text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="marketplace-panel p-4 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.imageUrl || "/placeholder.jpg"}
                      alt={product.name || "Product"}
                      className="h-44 w-full rounded-xl bg-slate-50 object-cover"
                    />
                  </Link>
                  <button
                    onClick={() => {
                      const storedUser = JSON.parse(localStorage.getItem("user"));
                      const userId = storedUser?.id;
                      if (!userId) return navigate("/login");
                      dispatch(addWishlistItem({ userId, productId: product.id }));
                    }}
                    className={`absolute right-2 top-2 rounded-full p-2 shadow ${
                      wishlistItems?.some((i) => String(i.productId) === String(product.id))
                        ? "bg-rose-500 text-white"
                        : "bg-white text-rose-500"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        wishlistItems?.some((i) => String(i.productId) === String(product.id))
                          ? "fill-white text-white"
                          : "text-rose-500"
                      }`}
                    />
                  </button>
                </div>

                <Link to={`/product/${product.id}`}>
                  <h3 className="mt-3 line-clamp-1 text-lg font-bold text-slate-900">{product.name || "Unnamed Product"}</h3>
                  <p className="text-sm text-slate-500">{product.categoryName || "Uncategorized"}</p>
                  <p className="mt-2 text-lg font-extrabold text-emerald-600">{formatPrice(product.price)}</p>
                </Link>

                <button
                  onClick={() => {
                    const storedUser = JSON.parse(localStorage.getItem("user"));
                    const userId = storedUser?.id;
                    if (!userId) return navigate("/login");
                    dispatch(addItem({ userId, productId: product.id, quantity: 1 }));
                  }}
                  className="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate(`/checkout?buyNow=1&productId=${product.id}&quantity=1`)}
                  className="mt-2 w-full rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Buy Now
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full py-12 text-center text-slate-500">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
