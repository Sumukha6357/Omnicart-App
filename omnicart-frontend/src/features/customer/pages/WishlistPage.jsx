import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../../../redux/wishlistSlice";
import { removeFromWishlist } from "../../../api/wishlistApi";
import { addItem } from "../../../redux/cartSlice";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const dispatch = useDispatch();\r\n  const { items } = useSelector((state) => state.wishlist);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  // Log items for debugging
  useEffect(() => {
    console.log("Wishlist items:", items);
  }, [items]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [dispatch, userId]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(userId, productId);
      dispatch(fetchWishlist(userId));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleAddToCart = (productId) => {
    if (!userId) {
      alert("You must be logged in to add to cart.");
      return;
    }
    dispatch(addItem({ userId, productId, quantity: 1 }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        <Link to="/customer/home" className="hover:text-blue-600">Customer</Link>
        <span className="mx-2">/</span>
        <span>Wishlist</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">My Wishlist</h2>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              Items you have saved for later.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-gray-600 dark:text-slate-300">
            Your wishlist is empty.
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <li
                key={item.productId}
                className="bg-gray-50 dark:bg-slate-950 border dark:border-slate-800 rounded-lg p-4 flex flex-col"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-40 object-cover mb-3 rounded"
                  />
                )}
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  Price: Rs. {item.price}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleAddToCart(item.productId)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;


