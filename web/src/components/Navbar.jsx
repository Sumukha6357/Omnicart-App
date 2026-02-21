import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useState, useEffect } from "react";
import { HeartIcon, ShoppingCart, Search, Moon, Sun, UserRound, MapPin, Globe2 } from "lucide-react";
import Profile from "./Profile";
import { SearchContext } from "../context/SearchContext";
import { ThemeContext } from "../context/ThemeContext";
import { fetchWishlist } from "../redux/wishlistSlice";
import { fetchCart } from "../redux/cartSlice";

const iconBtnClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-pill border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";

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
  const [locationLabel, setLocationLabel] = useState(localStorage.getItem("omnicart_location") || "Bengaluru 562130");
  const [region, setRegion] = useState(localStorage.getItem("omnicart_region") || "IN");
  const [language, setLanguage] = useState(localStorage.getItem("omnicart_language") || "EN");

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

  useEffect(() => {
    localStorage.setItem("omnicart_location", locationLabel);
    localStorage.setItem("omnicart_region", region);
    localStorage.setItem("omnicart_language", language);
  }, [locationLabel, region, language]);

  const goRoleHome = () => {
    const role =
      (user?.role ||
        (() => {
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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="mx-auto flex w-full max-w-7xl items-center gap-3 px-3 py-3 sm:px-6" aria-label="Main navigation">
        <button
          onClick={goRoleHome}
          className="inline-flex h-10 items-center rounded-lg bg-brand-600 px-3 text-base font-extrabold tracking-tight text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Go to home"
        >
          OmniCart
        </button>

        {!isAuthPage && (
          <button
            type="button"
            onClick={() => {
              const next = window.prompt("Update delivery location", locationLabel);
              if (next && next.trim()) setLocationLabel(next.trim());
            }}
            className="hidden items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:inline-flex"
            aria-label="Update delivery location"
            title="Update delivery location"
          >
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            <span className="max-w-[160px] truncate">{locationLabel}</span>
          </button>
        )}

        {!isAuthPage && (
          <div className="relative hidden flex-1 md:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search for products, brands and more"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-pill border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/30"
            />
          </div>
        )}

        {!isAuthPage && (
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900 md:flex">
              <Globe2 className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                aria-label="Region"
                className="bg-transparent font-semibold text-slate-700 outline-none dark:text-slate-200"
              >
                <option value="IN">IN</option>
                <option value="US">US</option>
                <option value="EU">EU</option>
              </select>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Language"
                className="bg-transparent font-semibold text-slate-700 outline-none dark:text-slate-200"
              >
                <option value="EN">EN</option>
                <option value="HI">HI</option>
                <option value="ES">ES</option>
              </select>
            </div>

            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              aria-label="Toggle theme"
              className={iconBtnClass}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {user && user.role?.toLowerCase() === "customer" && (
              <Link to="/wishlist" title="Wishlist" aria-label="Wishlist" className={iconBtnClass + " relative"}>
                <HeartIcon className="h-4 w-4" />
                {wishlistItems?.length > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-4 rounded-pill bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            )}

            {user && user.role?.toLowerCase() === "customer" && (
              <button
                onClick={() => navigate("/cart")}
                aria-label="Open cart"
                className="inline-flex h-10 items-center gap-1.5 rounded-pill bg-emerald-600 px-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartItems?.length > 0 && (
                  <span className="rounded-pill bg-white px-1 text-[10px] font-bold text-emerald-700">{cartItems.length}</span>
                )}
              </button>
            )}

            {token ? (
              <button
                className={iconBtnClass}
                onClick={() => setShowProfile(true)}
                title={user?.name || "Profile"}
                aria-label="Open profile"
              >
                <UserRound className="h-4 w-4" />
              </button>
            ) : (
              <>
                <Link to="/login" className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                  Login
                </Link>
                <Link to="/signup" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {!isAuthPage && (
        <div className="mx-auto w-full max-w-7xl px-3 pb-3 md:hidden sm:px-6">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => {
                const next = window.prompt("Update delivery location", locationLabel);
                if (next && next.trim()) setLocationLabel(next.trim());
              }}
              className="inline-flex items-center gap-1 rounded-pill border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900"
            >
              <MapPin className="h-3.5 w-3.5 text-brand-600" />
              <span className="max-w-[160px] truncate">{locationLabel}</span>
            </button>
            <span className="rounded-pill border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900">
              {region} | {language}
            </span>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search for products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-pill border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/30"
            />
          </div>
        </div>
      )}

      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </header>
  );
};

export default Navbar;
