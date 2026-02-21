import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useState, useEffect } from "react";
import { HeartIcon, ShoppingCart, Search, Moon, Sun } from "lucide-react";
import Profile from "./Profile";
import { SearchContext } from "../context/SearchContext";
import { ThemeContext } from "../context/ThemeContext";
import { fetchWishlist } from "../redux/wishlistSlice";
import { fetchCart } from "../redux/cartSlice";

const Navbar = () => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const { user, token } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { query, setQuery } = useContext(SearchContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const storedUser = (() => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch {
        return null;
      }
    })();
    const userId = user?.id || storedUser?.id;
    if (userId) {
      dispatch(fetchWishlist(userId));
      dispatch(fetchCart({ userId }));
    }
  }, [dispatch, user?.id]);

  const goRoleHome = () => {
    const role = (user?.role || (() => {
      try {
        return JSON.parse(localStorage.getItem("user"))?.role;
      } catch {
        return null;
      }
    })() || "").toLowerCase();

    if (role === "admin") return navigate("/admin/dashboard", { replace: true });
    if (role === "seller") return navigate("/seller/dashboard", { replace: true });
    if (role === "customer") return navigate("/customer/home", { replace: true });
    return navigate("/", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={goRoleHome}
          className="rounded-lg bg-gradient-to-r from-blue-600 to-orange-500 px-3 py-1.5 text-lg font-extrabold tracking-tight text-white"
        >
          OmniCart
        </button>

        {!isAuthPage && (
          <div className="relative hidden flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search products, categories and offers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
            />
          </div>
        )}

        {!isAuthPage && (
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="rounded-full border border-slate-300 bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {user && user.role?.toLowerCase() === "customer" && (
              <Link to="/wishlist" title="Wishlist" className="relative rounded-full bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/25 dark:text-rose-300 dark:hover:bg-rose-900/40">
                <HeartIcon className="h-5 w-5" />
                {wishlistItems?.length > 0 && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            )}

            {user && user.role?.toLowerCase() === "customer" && (
              <button
                onClick={() => navigate("/cart")}
                className="relative flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
                {cartItems?.length > 0 && (
                  <span className="rounded-full bg-white px-1.5 text-[10px] font-bold text-emerald-700 dark:bg-slate-950 dark:text-emerald-300">
                    {cartItems.length}
                  </span>
                )}
              </button>
            )}

            {token ? (
              <button
                className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={() => setShowProfile(true)}
                title={user?.name || "Profile"}
              >
                {user?.name
                  ? user.name.length <= 10
                    ? user.name
                    : user.name.split(/\s+/).map((n) => n[0]?.toUpperCase()).join("")
                  : "P"}
              </button>
            ) : (
              <>
                <Link to="/login" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Login
                </Link>
                <Link to="/signup" className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      {!isAuthPage && (
        <div className="mx-auto w-full max-w-7xl px-4 pb-3 md:hidden sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
            />
          </div>
        </div>
      )}
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </nav>
  );
};

export default Navbar;
