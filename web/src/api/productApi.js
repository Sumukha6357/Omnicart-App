import { filterAndSortProducts } from "./dummyProductUtils";

const DUMMY_PRODUCTS_URL = "https://dummyjson.com/products?limit=200";
const CUSTOM_PRODUCTS_KEY = "omnicart_custom_products";
const DELETED_PRODUCTS_KEY = "omnicart_deleted_product_ids";

const toUiProduct = (p) => ({
  id: String(p.id),
  name: p.name ?? p.title ?? "Unnamed Product",
  description: p.description ?? "",
  price: Number(p.price ?? 0),
  quantity: Number(p.quantity ?? p.stock ?? 0),
  rating: Number(p.rating ?? 0),
  categoryName: p.categoryName ?? p.category ?? "Uncategorized",
  imageUrl: p.imageUrl ?? p.thumbnail ?? p.images?.[0] ?? "",
  sellerId: p.sellerId ?? `dummy-seller-${(Number(p.id) % 3) + 1}`,
  sellerName: p.sellerName ?? "Dummy Seller",
  brand: p.brand ?? "",
  reviews: Array.isArray(p.reviews) ? p.reviews : [],
  createdAt: p.createdAt ?? new Date().toISOString(),
  popularity: Number(p.popularity ?? p.rating ?? 0),
});

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const loadBaseProducts = async () => {
  const res = await fetch(DUMMY_PRODUCTS_URL);
  if (!res.ok) throw new Error("Failed to fetch dummy products");
  const payload = await res.json();
  const products = Array.isArray(payload?.products) ? payload.products : [];
  return products.map(toUiProduct);
};

const loadMergedProducts = async () => {
  const base = await loadBaseProducts();
  const custom = readJson(CUSTOM_PRODUCTS_KEY, []).map(toUiProduct);
  const deletedIds = new Set(readJson(DELETED_PRODUCTS_KEY, []).map(String));
  const customById = new Map(custom.map((p) => [String(p.id), p]));

  const merged = base.map((p) => customById.get(String(p.id)) ?? p);
  const localOnly = custom.filter((p) => !base.some((b) => String(b.id) === String(p.id)));

  return [...merged, ...localOnly].filter((p) => !deletedIds.has(String(p.id)));
};

export const fetchAllProducts = async (params = {}) => {
  const products = await loadMergedProducts();
  return filterAndSortProducts(products, params);
};

export const fetchProductById = async (productId) => {
  const products = await loadMergedProducts();
  return products.find((p) => String(p.id) === String(productId)) || null;
};

export const createProduct = async (productData) => {
  const custom = readJson(CUSTOM_PRODUCTS_KEY, []);
  const created = toUiProduct({
    ...productData,
    id: `local-${Date.now()}`,
    categoryName: productData.categoryName ?? productData.category ?? "Uncategorized",
  });
  custom.push(created);
  writeJson(CUSTOM_PRODUCTS_KEY, custom);
  return created;
};

export const updateProduct = async (productId, productData) => {
  const custom = readJson(CUSTOM_PRODUCTS_KEY, []);
  const idx = custom.findIndex((p) => String(p.id) === String(productId));
  const updated = toUiProduct({ ...productData, id: productId });

  if (idx >= 0) {
    custom[idx] = updated;
  } else {
    custom.push(updated);
  }

  writeJson(CUSTOM_PRODUCTS_KEY, custom);
  return updated;
};

export const deleteProductById = async (productId) => {
  const custom = readJson(CUSTOM_PRODUCTS_KEY, []).filter((p) => String(p.id) !== String(productId));
  const deleted = new Set(readJson(DELETED_PRODUCTS_KEY, []).map(String));
  deleted.add(String(productId));
  writeJson(CUSTOM_PRODUCTS_KEY, custom);
  writeJson(DELETED_PRODUCTS_KEY, Array.from(deleted));
  return { success: true, id: String(productId) };
};

export const fetchProductsBySeller = async (sellerId, params = {}) => {
  const products = await loadMergedProducts();
  const matches = products.filter((p) => String(p.sellerId) === String(sellerId));
  const base = matches.length > 0 ? matches : products;
  return filterAndSortProducts(base, params);
};
