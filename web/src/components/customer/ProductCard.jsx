import { memo, useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatInr } from "../../utils/formatters";
import { useTitanium3DTilt, useSpotlightMask } from "../../hooks/useTitaniumMotion";

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

  useEffect(() => {
    setImgSrc(product.imageUrl || IMAGE_FALLBACK);
    setIsImageLoaded(false);
  }, [product.imageUrl, product.id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsImageLoaded(true);
      if (!imgSrc) setImgSrc(IMAGE_FALLBACK);
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [imgSrc]);

  const { ref: tiltRef, rotateX, rotateY, onMouseMove, onMouseLeave } = useTitanium3DTilt(10);
  const spotlightRef = useSpotlightMask();

  return (
    <article
      ref={tiltRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="group marketplace-card relative h-full overflow-hidden rounded-card border bg-bg-card p-4 shadow-titanium-depth transition-all duration-500 hover:shadow-card-hover"
    >
      <div 
        ref={spotlightRef}
        className="spotlight-hover absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
      />
      
      <div className="relative z-10">
        <Link
          to={`/product/${product.id}`}
          className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-bg-surface"
        >
          {!isImageLoaded && <div className="absolute inset-0 animate-pulse bg-border-soft" />}
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
            className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.1] ${isImageLoaded ? "block" : "hidden"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        <button
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => onToggleWishlist(product)}
          disabled={isTogglingWishlist}
          className={`absolute right-3 top-3 rounded-pill glass-bento p-2.5 shadow-sm transition-all hover:scale-110 active:scale-90 ${
            isWishlisted
              ? "text-brand-primary ring-2 ring-brand-primary/20"
              : "text-text-muted hover:text-brand-primary"
          }`}
        >
          <Heart
            className={`h-4.5 w-4.5 transition-all duration-300 ${
              isWishlisted ? "fill-brand-primary text-brand-primary" : ""
            }`}
          />
        </button>
      </div>

      <div className="mt-4 flex h-full flex-col">
        <Link to={`/product/${product.id}`} className="focus:outline-none">
          <h3 className="line-clamp-2 min-h-[48px] text-[16px] font-bold leading-tight text-text-default transition-colors group-hover:text-brand-primary">
            {product.name || "Unnamed Product"}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-1 text-xs font-medium uppercase tracking-wider text-text-muted">
          {product.brand || product.categoryName || "General Collection"}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-text-default">
              {formatInr(product.price)}
            </span>
            {ratingValue > 0 && (
              <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-brand-accent">
                <Star className="h-3 w-3 fill-current" />
                {ratingValue.toFixed(1)} 
                <span className="text-text-muted font-medium ml-1">({reviewCount})</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={isAddingCart}
            className="primary-cta group/btn relative flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all disabled:opacity-50"
          >
            {isAddingCart ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "Add to Cart"
            )}
          </button>
          
          <button
            type="button"
            onClick={() => onBuyNow(product)}
            className="rounded-xl border border-border-strong bg-white/50 px-3 py-3 text-xs font-bold text-text-default backdrop-blur-sm transition-all hover:bg-white hover:shadow-sm active:scale-95 dark:bg-white/5 dark:hover:bg-white/10"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
};

export default memo(ProductCard);
