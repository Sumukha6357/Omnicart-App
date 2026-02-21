import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { addWishlistItem } from "../../../redux/wishlistSlice";
import { getAllProducts, getProductById } from "../../../redux/productSlice";
import { addItem, fetchCart } from "../../../redux/cartSlice";
import { Heart, Star } from "lucide-react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { ToastContext } from "../../../context/ToastContext";
import { getRoleHomePath } from "../../../utils/navigation";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, products, loading } = useSelector((state) => state.product);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [quantity, setQuantity] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    if (!id) return;
    dispatch(getProductById(id));
  }, [id, dispatch]);

  const productToShow = product;
  const imageFallback =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><rect width='100%' height='100%' fill='#e2e8f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#64748b' font-size='30' font-family='Arial'>OmniCart</text></svg>`
    );

  useEffect(() => {
    setImgSrc(productToShow?.imageUrl || imageFallback);
    setIsImageLoaded(false);
  }, [productToShow?.imageUrl]);

  useEffect(() => {
    if (!productToShow?.categoryName) return;
    if (!products || products.length === 0) {
      dispatch(getAllProducts({ category: productToShow.categoryName }));
    }
  }, [id, productToShow?.categoryName, products, dispatch]);

  if (loading || !productToShow) {
    return <p className="mt-10 text-center text-slate-600 dark:text-slate-300">Loading product...</p>;
  }

  const handleAddToWishlist = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    if (!userId) {
      showToast("Please login to add wishlist items.", "info");
      return;
    }
    dispatch(addWishlistItem({ userId, productId: productToShow.id }));
    showToast("Wishlist updated.", "success");
  };

  const handleAddToCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    if (!userId) {
      showToast("Please login to add cart items.", "info");
      return;
    }
    dispatch(addItem({ userId, productId: productToShow.id, quantity })).then(() =>
      dispatch(fetchCart({ userId }))
    );
    showToast("Added to cart.", "success");
  };

  const handleBuyNow = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    if (!userId) {
      showToast("Please login to continue checkout.", "info");
      return;
    }
    showToast("Proceeding to checkout.", "info");
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
  const homePath = getRoleHomePath(JSON.parse(localStorage.getItem("user") || "null")?.role);
  const recommendations = (products || [])
    .filter((p) => p?.id !== productToShow?.id)
    .filter((p) => {
      if (!categoryName || !p?.categoryName) return false;
      return p.categoryName.toLowerCase() === categoryName.toLowerCase();
    })
    .slice(0, 6);
  const reviewsToShow = Array.isArray(productToShow?.reviews) ? productToShow.reviews : [];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          items={[
            { label: "Home", to: homePath },
            { label: productToShow?.categoryName || "Products", to: homePath },
            { label: productToShow?.name || "Detail" },
          ]}
        />

        <button
          onClick={handleBackHome}
          className="mb-4 flex items-center font-bold text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
        >
          <span className="mr-1 text-2xl">&#60;</span> Home
        </button>

        <div className="marketplace-panel p-6 md:p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="relative">
              {!isImageLoaded && (
                <div className="h-80 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
              )}
              <img
                src={imgSrc}
                alt={productToShow.name}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                  if (imgSrc !== imageFallback) {
                    setImgSrc(imageFallback);
                  }
                  setIsImageLoaded(true);
                }}
                className={`h-80 w-full rounded-xl bg-gray-50 object-contain dark:bg-slate-950 ${isImageLoaded ? "block" : "hidden"}`}
              />
              <button
                onClick={handleAddToWishlist}
                className={`absolute right-3 top-3 rounded-full p-2 shadow transition ${
                  wishlistItems?.some((i) => String(i.productId) === String(productToShow.id))
                    ? "scale-105 bg-red-600 text-white ring-2 ring-red-200"
                    : "border bg-white text-red-500 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-900"
                }`}
                title="Add to Wishlist"
              >
                <Heart
                  className={`h-5 w-5 ${
                    wishlistItems?.some((i) => String(i.productId) === String(productToShow.id))
                      ? "fill-white text-white"
                      : "text-red-500"
                  }`}
                />
              </button>
            </div>

            <div>
              <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-slate-100">{productToShow.name}</h1>
              <p className="mb-4 text-gray-700 dark:text-slate-200">
                {productToShow.description || "No description available."}
              </p>

              <div className="mb-4 text-2xl font-semibold text-green-600">Rs. {productToShow.price}</div>

              <div className="mb-6 flex items-center gap-3">
                <span className="font-semibold">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="rounded bg-gray-200 px-3 py-1 transition hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-16 rounded border bg-white text-center dark:border-slate-700 dark:bg-slate-950"
                  />
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="rounded bg-gray-200 px-3 py-1 transition hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={handleAddToCart} className="primary-cta">
                  Add to Cart
                </button>
                <button onClick={handleBuyNow} className="accent-cta">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="marketplace-panel p-6">
            <h2 className="mb-4 text-lg font-bold">Product Details</h2>
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

          <div className="marketplace-panel p-6">
            <h2 className="mb-4 text-lg font-bold">Specifications</h2>
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

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="marketplace-panel p-6">
            <h2 className="mb-3 text-lg font-bold">How it works</h2>
            {productToShow?.usageNotes || productToShow?.howItWorks ? (
              <p className="text-sm text-gray-700 dark:text-slate-300">
                {productToShow.usageNotes || productToShow.howItWorks}
              </p>
            ) : (
              <div className="text-sm text-gray-600 dark:text-slate-300">No usage details available.</div>
            )}
          </div>

          <div className="marketplace-panel p-6">
            <h2 className="mb-3 text-lg font-bold">Care & maintenance</h2>
            {productToShow?.careInstructions ? (
              <p className="text-sm text-gray-700 dark:text-slate-300">{productToShow.careInstructions}</p>
            ) : (
              <div className="text-sm text-gray-600 dark:text-slate-300">No care instructions available.</div>
            )}
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-bold">More like this</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="marketplace-panel lift-card flex flex-col p-4">
                  <Link to={`/product/${rec.id}`} className="block">
                    <img
                      src={rec.imageUrl || "/placeholder.jpg"}
                      alt={rec.name}
                      className="mb-3 h-40 w-full rounded-lg bg-gray-50 object-contain dark:bg-slate-950"
                    />
                    <div className="mb-1 font-semibold">{rec.name}</div>
                  </Link>
                  <div className="mb-3 font-bold text-green-600">Rs. {rec.price}</div>
                  <Link
                    to={`/product/${rec.id}`}
                    className="primary-cta mt-auto inline-flex items-center justify-center"
                  >
                    View Product
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="marketplace-panel mt-10 p-6">
          <h2 className="mb-4 text-xl font-bold">Reviews</h2>
          {reviewsToShow.length === 0 ? (
            <div className="text-sm text-gray-600 dark:text-slate-300">No reviews yet.</div>
          ) : (
            <div className="space-y-4">
              {reviewsToShow.map((review) => (
                <div key={review.id || review.comment || review.text} className="rounded-lg border p-4 dark:border-slate-800">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-semibold">
                      {review.name || review.reviewerName || "Verified Buyer"}
                    </div>
                    <div className="inline-flex items-center gap-1 text-sm text-yellow-600">
                      <Star className="h-4 w-4 fill-current" />
                      {Number(review.rating || 0).toFixed(1)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-slate-300">
                    {review.text || review.comment || "No written review provided."}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
