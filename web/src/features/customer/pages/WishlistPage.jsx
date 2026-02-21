import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWishlist } from "../../../redux/wishlistSlice";
import { removeFromWishlist } from "../../../api/wishlistApi";
import { addItem } from "../../../redux/cartSlice";
import { ToastContext } from "../../../context/ToastContext";
import CustomerPageShell from "../../../components/customer/CustomerPageShell";
import { formatInr } from "../../../utils/formatters";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);
  const { items = [] } = useSelector((state) => state.wishlist);
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [dispatch, userId]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(userId, productId);
      dispatch(fetchWishlist(userId));
      showToast("Removed from wishlist.", "info");
    } catch {
      showToast("Failed to remove item.", "error");
    }
  };

  const handleAddToCart = async (productId) => {
    if (!userId) {
      showToast("Please login first.", "info");
      navigate("/login");
      return;
    }
    await dispatch(addItem({ userId, productId, quantity: 1 }));
    showToast("Added to cart.", "success");
  };

  return (
    <CustomerPageShell
      userRole={user?.role}
      pageLabel="Wishlist"
      title="My Wishlist"
      subtitle="Items you've saved for later"
      actions={
        <span className="rounded-pill border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {items.length} items
        </span>
      }
    >
      {items.length === 0 ? (
        <div className="rounded-card border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">Your wishlist is empty.</p>
          <button
            type="button"
            onClick={() => navigate("/customer/home")}
            className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.productId}
              className="rounded-card border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <img
                src={item.imageUrl || "/placeholder.jpg"}
                alt={item.name || "Product"}
                className="h-44 w-full rounded-lg bg-slate-100 object-cover dark:bg-slate-950"
              />
              <h3 className="mt-3 line-clamp-2 min-h-12 text-base font-bold text-slate-900 dark:text-slate-100">
                {item.name || "Unnamed Product"}
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{formatInr(item.price)}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleAddToCart(item.productId)}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Add to Cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </CustomerPageShell>
  );
};

export default WishlistPage;
