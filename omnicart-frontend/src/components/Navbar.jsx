// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useState } from "react";
import Profile from "./Profile";
import { HeartIcon } from "lucide-react"; // Make sure lucide-react is installed

const Navbar = () => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  const { user, token } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Redirect to home after logout
  };

  const [showProfile, setShowProfile] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          className="text-2xl font-bold text-blue-600 focus:outline-none"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          onClick={() => {
            // Always read user from localStorage for reliability
            let userData = null;
            try {
              userData = JSON.parse(localStorage.getItem("user"));
            } catch {}
            if (userData && userData.role) {
              const role = String(userData.role).toLowerCase();
              if (role === "admin") {
                navigate("/admin/dashboard", { replace: true });
                return;
              }
              if (role === "seller") {
                navigate("/seller/dashboard", { replace: true });
                return;
              }
              if (role === "customer") {
                navigate("/customer/home", { replace: true });
                return;
              }
              // Default for unknown
              navigate("/", { replace: true });
              return;
            }
            // Not logged in
            navigate("/", { replace: true });
          }}
        >
          OmniCart
        </button>
      </div>

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
            <Link to="/wishlist" title="Wishlist">
              <HeartIcon className="w-6 h-6 text-red-500 hover:text-red-600" />
            </Link>
          )}

          {/* Cart Button for Customers */}
          {user && user.role?.toLowerCase() === "customer" && (
            <button
              onClick={() => navigate("/cart")}
              className="relative bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center"
            >
              🛒 Cart
              {cartItems?.length > 0 && (
                <span className="ml-1 bg-white text-green-700 font-bold rounded-full px-2">
                  {cartItems.length}
                </span>
              )}
            </button>
          )}

          {token ? (
            <>
              {/* Removed user name from navbar */}
              <button
                className="font-bold text-blue-600 text-lg bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
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
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
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
