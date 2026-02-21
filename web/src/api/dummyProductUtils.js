const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

export const filterAndSortProducts = (products, params = {}) => {
  const search = (params.search || "").toString().toLowerCase();
  const category = (params.category || "").toString().toLowerCase();
  const minPrice = toNumber(params.minPrice);
  const maxPrice = toNumber(params.maxPrice);
  const minRating = toNumber(params.minRating);
  const sort = (params.sort || "").toString().toLowerCase();

  let filtered = Array.isArray(products) ? [...products] : [];

  if (search) {
    filtered = filtered.filter((p) => {
      const name = (p.name || "").toString().toLowerCase();
      const desc = (p.description || "").toString().toLowerCase();
      return name.includes(search) || desc.includes(search);
    });
  }

  if (category) {
    filtered = filtered.filter((p) =>
      (p.categoryName || "").toString().toLowerCase().includes(category)
    );
  }

  if (minPrice !== null) {
    filtered = filtered.filter((p) => Number(p.price) >= minPrice);
  }

  if (maxPrice !== null) {
    filtered = filtered.filter((p) => Number(p.price) <= maxPrice);
  }

  if (minRating !== null) {
    filtered = filtered.filter((p) => Number(p.rating || 0) >= minRating);
  }

  switch (sort) {
    case "price_asc":
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case "price_desc":
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case "newest":
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      break;
    case "popular":
      filtered.sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0));
      break;
    case "rating":
      filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      break;
    default:
      break;
  }

  return filtered;
};
