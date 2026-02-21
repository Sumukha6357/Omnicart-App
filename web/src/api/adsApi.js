const ADS_STORAGE_KEY = "omnicart_ads";

const defaultAds = [
  {
    id: "ad-fashion",
    title: "Fashion Flash Sale",
    subtitle: "Up to 50% off on daily styles",
    imageUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80",
    category: "beauty",
    ctaText: "Shop Fashion",
    ctaLink: "/customer/home",
    enabled: true,
  },
  {
    id: "ad-electronics",
    title: "Top Rated Electronics",
    subtitle: "Smart picks curated for you",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80",
    category: "smartphones",
    ctaText: "Explore Deals",
    ctaLink: "/customer/home",
    enabled: true,
  },
  {
    id: "ad-home",
    title: "Home Essentials Week",
    subtitle: "Kitchen, decor and storage at better prices",
    imageUrl:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1400&q=80",
    category: "home-decoration",
    ctaText: "Browse Home",
    ctaLink: "/customer/home",
    enabled: true,
  },
];

const readAds = () => {
  try {
    const raw = localStorage.getItem(ADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(defaultAds));
      return [...defaultAds];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...defaultAds];
  } catch {
    return [...defaultAds];
  }
};

const writeAds = (ads) => {
  localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(ads));
};

export const getAllAds = async () => {
  return readAds();
};

export const getEnabledAds = async () => {
  return readAds().filter((ad) => ad.enabled !== false);
};

export const createAd = async (payload) => {
  const ads = readAds();
  const ad = {
    id: `ad-${Date.now()}`,
    title: payload.title || "Untitled Ad",
    subtitle: payload.subtitle || "",
    imageUrl: payload.imageUrl || "",
    category: payload.category || "",
    ctaText: payload.ctaText || "Shop Now",
    ctaLink: payload.ctaLink || "/customer/home",
    enabled: payload.enabled !== false,
  };
  ads.unshift(ad);
  writeAds(ads);
  return ad;
};

export const updateAd = async (id, payload) => {
  const ads = readAds();
  const nextAds = ads.map((ad) =>
    ad.id === id
      ? {
          ...ad,
          ...payload,
        }
      : ad
  );
  writeAds(nextAds);
  return nextAds.find((ad) => ad.id === id);
};

export const deleteAd = async (id) => {
  const ads = readAds();
  const nextAds = ads.filter((ad) => ad.id !== id);
  writeAds(nextAds);
  return { success: true };
};
