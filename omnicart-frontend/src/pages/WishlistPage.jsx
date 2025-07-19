import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../redux/wishlistSlice";
import { removeFromWishlist } from "../api/wishlistApi";
import { addItem } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.wishlist);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  // ✅ Log items instead of undefined variable
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
    <div className="p-6">
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-bold"
      >
        <span className="text-2xl mr-1">&#60;</span> Home
      </button>
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

      {items.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <li key={item.productId} className="bg-white shadow rounded-lg p-4">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
              )}
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">Price: ₹{item.price}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Remove from Wishlist
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
  );
};

export default WishlistPage;
