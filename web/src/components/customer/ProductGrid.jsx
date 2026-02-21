import { memo } from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({
  products,
  wishlistSet,
  cartLoadingById,
  wishlistLoadingById,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
}) => {
  return (
    <section aria-label="Products">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 2xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlistSet.has(String(product.id))}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
            isAddingCart={Boolean(cartLoadingById[String(product.id)])}
            isTogglingWishlist={Boolean(wishlistLoadingById[String(product.id)])}
          />
        ))}
      </div>
    </section>
  );
};

export default memo(ProductGrid);
