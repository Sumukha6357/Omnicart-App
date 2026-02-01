import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { addWishlistItem } from "../../../redux/wishlistSlice";
import { getAllProducts, getProductById } from "../../../redux/productSlice";
import { addItem, fetchCart } from "../../../redux/cartSlice";
import { Heart } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, products, loading } = useSelector((state) => state.product);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    dispatch(getProductById(id));
  }, [id, dispatch]);

  const productToShow = product;

  useEffect(() => {
    if (!productToShow?.categoryName) return;
    if (!products || products.length === 0) {
      dispatch(getAllProducts({ category: productToShow.categoryName }));
    }
  }, [id, productToShow?.categoryName, products, dispatch]);

  if (loading || !productToShow) {
    return <p className="text-center mt-10">Loading product...</p>;
  }

  const handleAddToWishlist = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    if (!userId) {
      alert("You must be logged in to add to wishlist.");
      return;
    }
    dispatch(addWishlistItem({ userId, productId: productToShow.id }));
  };

  const handleAddToCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    if (!userId) {
      alert("You must be logged in to add to cart.");
      return;
    }
    dispatch(addItem({ userId, productId: productToShow.id, quantity }))
      .then(() => dispatch(fetchCart({ userId })));
  };

  const handleBuyNow = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    if (!userId) {
      alert("You must be logged in to buy.");
      return;
    }
    navigate(`/checkout?buyNow=1&productId=${productToShow.id}&quantity=${quantity}`);
  };

  const handleBackHome = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role?.toLowerCase();
    if (role === "customer") {
      navigate("/customer/home");
    } else {
      navigate("/");
    }
  };

  const categoryName = productToShow?.categoryName;
  const recommendations = (products || [])
    .filter((p) => p?.id !== productToShow?.id)
    .filter((p) => {
      if (!categoryName || !p?.categoryName) return false;
      return p.categoryName.toLowerCase() === categoryName.toLowerCase();
    })
    .slice(0, 6);
  const reviewsToShow = Array.isArray(productToShow?.reviews) ? productToShow.reviews : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleBackHome}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-bold"
        >
          <span className="text-2xl mr-1">&#60;</span> Home
        </button>

        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <img
                src={productToShow.imageUrl || "/placeholder.jpg"}
                alt={productToShow.name}
                className="w-full h-80 object-contain bg-gray-50 dark:bg-slate-950 rounded-xl"
              />
              <button
                onClick={handleAddToWishlist}
                className={`absolute top-3 right-3 p-2 rounded-full shadow transition ${
                  wishlistItems?.some((i) => String(i.productId) === String(productToShow.id))
                    ? "bg-red-600 text-white ring-2 ring-red-200 scale-105"
                    : "bg-white dark:bg-slate-900 border dark:border-slate-700 text-red-500 hover:bg-red-50"
                }`}
                title="Add to Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${
                    wishlistItems?.some((i) => String(i.productId) === String(productToShow.id))
                      ? "text-white fill-white"
                      : "text-red-500"
                  }`}
                />
              </button>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-3">{productToShow.name}</h1>
              <p className="text-gray-700 dark:text-slate-200 mb-4">
                {productToShow.description || "No description available."}
              </p>

              <div className="text-2xl font-semibold text-green-600 mb-4">
                Rs. {productToShow.price}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-semibold">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 bg-gray-200 dark:bg-slate-800 rounded"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-16 border dark:border-slate-700 rounded text-center bg-white dark:bg-slate-950"
                  />
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1 bg-gray-200 dark:bg-slate-800 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Product Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-slate-300">
              <div>
                <div className="font-semibold">Category</div>
                <div>{productToShow.categoryName || "N/A"}</div>
              </div>
              <div>
                <div className="font-semibold">Seller</div>
                <div>{productToShow.sellerName || "N/A"}</div>
              </div>
              <div>
                <div className="font-semibold">Stock</div>
                <div>{productToShow.quantity ?? "N/A"}</div>
              </div>
              <div>
                <div className="font-semibold">Rating</div>
                <div>{productToShow.rating ?? "N/A"}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-slate-300">
              <div>
                <div className="font-semibold">Brand</div>
                <div>{productToShow.brand || "N/A"}</div>
              </div>
              <div>
                <div className="font-semibold">Warranty</div>
                <div>{productToShow.warranty || "N/A"}</div>
              </div>
              <div>
                <div className="font-semibold">Material</div>
                <div>{productToShow.material || productToShow.ingredients || "N/A"}</div>
              </div>
              <div>
                <div className="font-semibold">Origin</div>
                <div>{productToShow.origin || "N/A"}</div>
              </div>
              {productToShow.connectivity && (
                <div>
                  <div className="font-semibold">Connectivity</div>
                  <div>{productToShow.connectivity}</div>
                </div>
              )}
              {productToShow.power && (
                <div>
                  <div className="font-semibold">Power</div>
                  <div>{productToShow.power}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-3">How it works</h2>
            {productToShow?.usageNotes || productToShow?.howItWorks ? (
              <p className="text-sm text-gray-700 dark:text-slate-300">
                {productToShow.usageNotes || productToShow.howItWorks}
              </p>
            ) : (
              <div className="text-sm text-gray-600 dark:text-slate-300">No usage details available.</div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-3">Care & maintenance</h2>
            {productToShow?.careInstructions ? (
              <p className="text-sm text-gray-700 dark:text-slate-300">
                {productToShow.careInstructions}
              </p>
            ) : (
              <div className="text-sm text-gray-600 dark:text-slate-300">No care instructions available.</div>
            )}
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">More like this</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl shadow-sm p-4 flex flex-col"
                >
                  <Link to={`/product/${rec.id}`} className="block">
                    <img
                      src={rec.imageUrl || "/placeholder.jpg"}
                      alt={rec.name}
                      className="w-full h-40 object-contain bg-gray-50 dark:bg-slate-950 rounded-lg mb-3"
                    />
                    <div className="font-semibold mb-1">{rec.name}</div>
                  </Link>
                  <div className="text-green-600 font-bold mb-3">Rs. {rec.price}</div>
                  <Link
                    to={`/product/${rec.id}`}
                    className="mt-auto inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
                  >
                    View Product
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          {reviewsToShow.length === 0 ? (
            <div className="text-sm text-gray-600 dark:text-slate-300">
              No reviews yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reviewsToShow.map((review) => (
                <div key={review.id} className="border dark:border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-yellow-600">{"★".repeat(review.rating)}</div>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-slate-300">{review.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
