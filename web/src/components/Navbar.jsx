// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useState, useEffect } from "react";
import Profile from "./Profile";
import { HeartIcon } from "lucide-react"; // Make sure lucide-react is installed
import { SearchContext } from "../context/SearchContext";
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

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          className="text-2xl font-bold text-blue-600 dark:text-blue-400 focus:outline-none"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          onClick={() => {
            // Prefer redux user; fall back to localStorage if needed.
            let role = user?.role;
            if (!role) {
              try {
                const userData = JSON.parse(localStorage.getItem("user"));
                role = userData?.role;
              } catch {}
            }
            if (role) {
              const normalized = String(role).toLowerCase();
              if (normalized === "admin") {
                navigate("/admin/dashboard", { replace: true });
                return;
              }
              if (normalized === "seller") {
                navigate("/seller/dashboard", { replace: true });
                return;
              }
              if (normalized === "customer") {
                navigate("/customer/home", { replace: true });
                return;
              }
            }
            // Not logged in or unknown role
            navigate("/", { replace: true });
          }}
        >
          OmniCart
        </button>
      </div>

      {!isAuthPage && (
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-80 lg:w-[28rem] rounded-full border dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-100 px-4 py-2 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔎
              </span>
            </div>
          </div>
        </div>
      )}

      {!isAuthPage && (
        <div className="space-x-4 flex items-center">
          {/* <Link to="/">Home</Link> */}

          {user && user.role === "admin" && (
            <Link to="/admin/dashboard">Admin Dashboard</Link>
          )}

          {user && user.role === "seller" && (
            <Link to="/seller/dashboard">Seller Dashboard</Link>
          )}

          {/* Wishlist Icon for Customers */}
          {user && user.role?.toLowerCase() === "customer" && (
            <Link to="/wishlist" title="Wishlist" className="relative">
              <HeartIcon className="w-6 h-6 text-red-500 hover:text-red-600" />
              {wishlistItems?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
          )}

          {/* Cart Button for Customers */}
          {user && user.role?.toLowerCase() === "customer" && (
            <button
              onClick={() => navigate("/cart")}
              className="relative bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center"
            >
              Cart
              {cartItems?.length > 0 && (
                <span className="ml-1 bg-white dark:bg-slate-800 text-green-700 dark:text-green-300 font-bold rounded-full px-2">
                  {cartItems.length}
                </span>
              )}
            </button>
          )}

          {token ? (
            <>
              {/* Removed user name from navbar */}
              <button
                className="font-bold text-blue-600 dark:text-blue-400 text-lg bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                onClick={() => {
                  setShowProfile(true);
                }}
                title={user?.name || "Profile"}
              >
                {user?.name
                  ? (user.name.length <= 10
                      ? user.name
                      : user.name
                          .split(/\s+/)
                          .map((n) => n[0]?.toUpperCase())
                          .join("")
                    )
                  : "P"}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}

      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </nav>
  );
};

export default Navbar;




