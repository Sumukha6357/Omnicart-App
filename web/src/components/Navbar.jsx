import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useState, useEffect } from "react";
import { HeartIcon, ShoppingCart, Search, Moon, Sun, UserRound, MapPin, Globe2 } from "lucide-react";
import Profile from "./Profile";
import { SearchContext } from "../context/SearchContext";
import { ThemeContext } from "../context/ThemeContext";
import { fetchWishlist } from "../redux/wishlistSlice";
import { fetchCart } from "../redux/cartSlice";
import { useMagneticPull } from "../hooks/useTitaniumMotion";
import { cn } from "../utils/cn";

const iconBtnClass =
  "group relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-bg-surface text-text-default transition-all hover:bg-bg-card hover:shadow-sm active:scale-95";

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

  const logoMagnetic = useMagneticPull(0.2);
  const cartMagnetic = useMagneticPull(0.2);

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

  const quickCategories = [
    { label: "All", value: "" },
    { label: "Today's Deals", value: "" },
    { label: "Beauty", value: "beauty" },
    { label: "Home & Kitchen", value: "home-decoration" },
    { label: "Groceries", value: "groceries" },
    { label: "Smartphones", value: "smartphones" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-bg-page/80 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6" aria-label="Main navigation">
        <motion.button
          ref={logoMagnetic.ref}
          onMouseMove={logoMagnetic.handleMouseMove}
          onMouseLeave={logoMagnetic.handleMouseLeave}
          style={{ x: logoMagnetic.x, y: logoMagnetic.y }}
          onClick={goRoleHome}
          className="relative inline-flex h-11 items-center rounded-xl bg-brand-primary px-5 text-base font-black tracking-tight text-white shadow-lg shadow-brand-primary/25 transition-all hover:scale-[1.05] hover:shadow-brand-primary/40 active:scale-95"
          aria-label="Go to home"
        >
          <div className="absolute inset-0 animate-titanium-shimmer rounded-xl opacity-20" />
          OmniCart
        </motion.button>

        {!isAuthPage && (
          <button
            type="button"
            onClick={() => {
              const next = window.prompt("Update delivery location", locationLabel);
              if (next && next.trim()) setLocationLabel(next.trim());
            }}
            className="hidden items-center gap-2 rounded-xl border border-border-soft bg-bg-surface px-3 py-2.5 text-xs font-bold text-text-default transition-all hover:border-border-strong hover:bg-bg-card lg:inline-flex"
            aria-label="Update delivery location"
            title="Update delivery location"
          >
            <MapPin className="h-4 w-4 text-brand-primary" />
            <span className="max-w-[160px] truncate uppercase tracking-wide">{locationLabel}</span>
          </button>
        )}

        {!isAuthPage && (
          <div className="relative hidden lg:block flex-1 max-w-xl mx-auto">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search for perfection..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-2xl border border-border-soft bg-bg-surface pl-11 pr-4 text-sm text-text-default shadow-sm outline-none transition-all placeholder:text-text-muted/50 focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5"
            />
          </div>
        )}

        {!isAuthPage && (
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-0.5 rounded-xl border border-border-soft bg-bg-surface p-1 text-[10px] font-black md:flex">
              <Globe2 className="mx-2 h-3.5 w-3.5 text-text-muted" />
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                aria-label="Region"
                className="bg-transparent px-1 outline-none text-text-default"
              >
                <option value="IN">IN</option>
                <option value="US">US</option>
                <option value="EU">EU</option>
              </select>
              <div className="w-[1px] h-3 bg-border-soft mx-1" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Language"
                className="bg-transparent px-1 outline-none text-text-default"
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
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <div className="absolute inset-0 rounded-xl border border-white/10 opacity-0 transition-opacity group-hover:opacity-100 dark:border-white/5" />
            </button>

            {user && user.role?.toLowerCase() === "customer" && (
              <Link to="/wishlist" title="Wishlist" aria-label="Wishlist" className={iconBtnClass}>
                <HeartIcon className="h-5 w-5" />
                {wishlistItems?.length > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-black text-white ring-4 ring-bg-page">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            )}

            {user && user.role?.toLowerCase() === "customer" && (
              <motion.button
                ref={cartMagnetic.ref}
                onMouseMove={cartMagnetic.handleMouseMove}
                onMouseLeave={cartMagnetic.handleMouseLeave}
                style={{ x: cartMagnetic.x, y: cartMagnetic.y }}
                onClick={() => navigate("/cart")}
                aria-label="Open cart"
                className="group relative inline-flex h-11 items-center gap-2 rounded-xl bg-brand-accent/10 px-4 text-sm font-bold text-brand-accent transition-all hover:bg-brand-accent/20 active:scale-95"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Cart</span>
                {cartItems?.length > 0 && (
                  <span className="rounded-lg bg-brand-accent px-2 py-0.5 text-[10px] font-black text-white">{cartItems.length}</span>
                )}
                <div className="absolute inset-0 rounded-xl border border-brand-accent/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.button>
            )}

            {token ? (
              <button
                className={iconBtnClass}
                onClick={() => setShowProfile(true)}
                title={user?.name || "Profile"}
                aria-label="Open profile"
              >
                <UserRound className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2.5 text-sm font-bold text-text-default hover:text-brand-primary transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="primary-cta px-5 py-2.5 text-sm font-black">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {!isAuthPage && (
        <div className="mx-auto w-full max-w-7xl px-4 pb-3 lg:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-2xl border border-border-soft bg-bg-surface pl-11 pr-4 text-sm text-text-default shadow-sm outline-none transition-all focus:border-brand-primary/50"
            />
          </div>
        </div>
      )}

      {!isAuthPage && (
        <div className="border-t border-border-soft bg-bg-page/50">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 scrollbar-hide">
            {quickCategories.map((cat) => {
              const currentCat = localStorage.getItem("omnicart_pref_category") || "";
              const isActive = currentCat === cat.value;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => {
                    localStorage.setItem("omnicart_pref_category", cat.value);
                    if (cat.label === "Today's Deals") {
                      localStorage.setItem("omnicart_pref_sort", "popular");
                    } else {
                      localStorage.setItem("omnicart_pref_sort", "");
                    }
                    navigate("/customer/home");
                  }}
                  className={cn(
                    "group relative whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-all",
                    isActive 
                      ? "text-brand-primary" 
                      : "text-text-muted hover:text-text-default"
                  )}
                >
                  {cat.label}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-glow"
                      className="absolute inset-0 z-[-1] rounded-lg bg-brand-primary/5 shadow-luminous-glow"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-bar"
                      className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-brand-primary"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </header>
  );
};

export default Navbar;
