import { memo, useState } from "react";
import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatInr } from "../../utils/formatters";

const IMAGE_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='750'><rect width='100%' height='100%' fill='#e2e8f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#64748b' font-size='28' font-family='Arial'>OmniCart</text></svg>`
  );

const ProductCard = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  isAddingCart,
  isTogglingWishlist,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.imageUrl || IMAGE_FALLBACK);
  const ratingValue = Number(product?.rating || 0);
  const reviewCount = Array.isArray(product?.reviews) ? product.reviews.length : 0;

  return (
    <article className="group marketplace-card h-full rounded-card border border-slate-200 bg-white p-3.5 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900">
      <div className="relative">
        <Link
          to={`/product/${product.id}`}
          className="block aspect-[4/5] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950"
        >
          {!isImageLoaded && <div className="h-full w-full animate-pulse bg-slate-200 dark:bg-slate-800" />}
          <img
            src={imgSrc}
            alt={product.name || "Product"}
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => {
              if (imgSrc !== IMAGE_FALLBACK) {
                setImgSrc(IMAGE_FALLBACK);
              }
              setIsImageLoaded(true);
            }}
            className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.02] ${isImageLoaded ? "block" : "hidden"}`}
          />
        </Link>

        <button
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => onToggleWishlist(product)}
          disabled={isTogglingWishlist}
          className={`absolute right-2 top-2 rounded-pill border border-slate-200 bg-white p-2 shadow-sm transition hover:scale-105 dark:border-slate-700 dark:bg-slate-900 ${
            isWishlisted ? "text-rose-500" : "text-slate-500 dark:text-slate-300"
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      <div className="mt-3 flex h-full flex-col">
        <Link to={`/product/${product.id}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
          <h3 className="line-clamp-2 min-h-12 text-[15px] font-semibold leading-5 text-slate-900 dark:text-slate-100">
            {product.name || "Unnamed Product"}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
          {product.brand || product.categoryName || "General"}
        </p>

        {ratingValue > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Star className="h-3 w-3 fill-current" />
              {ratingValue.toFixed(1)}
            </span>
            {reviewCount > 0 && <span>({reviewCount})</span>}
          </div>
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{formatInr(product.price)}</p>
        </div>

        <div className="mt-auto space-y-2 pt-3">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={isAddingCart}
            className="w-full rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isAddingCart ? "Adding..." : "Add to Cart"}
          </button>
          <button
            type="button"
            onClick={() => onBuyNow(product)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
};

export default memo(ProductCard);
