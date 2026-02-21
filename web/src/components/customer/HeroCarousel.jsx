import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const fallbackSlides = [
  {
    id: "hero-1",
    title: "Daily essentials at smart prices",
    subtitle: "Limited time bundles for groceries and home needs",
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
    ctaText: "Shop Essentials",
  },
  {
    id: "hero-2",
    title: "Upgrade your home, room by room",
    subtitle: "Furniture and decor picks refreshed weekly",
    imageUrl:
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1600&q=80",
    ctaText: "Explore Home",
  },
  {
    id: "hero-3",
    title: "Beauty and personal care fest",
    subtitle: "Trending skincare, makeup and wellness products",
    imageUrl:
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1600&q=80",
    ctaText: "View Offers",
  },
];

export default function HeroCarousel({ ads = [], onSlideAction, locationLabel }) {
  const slides = useMemo(() => (Array.isArray(ads) && ads.length > 0 ? ads : fallbackSlides), [ads]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (activeIndex > slides.length - 1) setActiveIndex(0);
  }, [activeIndex, slides.length]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[activeIndex];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm dark:border-slate-800" aria-label="Hero promotions">
      <img
        src={activeSlide?.imageUrl}
        alt={activeSlide?.title || "Offer banner"}
        className="h-64 w-full object-cover md:h-80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/20" />

      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous banner"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-pill border border-white/50 bg-black/30 p-2 text-white transition hover:bg-black/45"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Next banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-pill border border-white/50 bg-black/30 p-2 text-white transition hover:bg-black/45"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-pill bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
        <MapPin className="h-3.5 w-3.5" />
        Delivering to {locationLabel || "your area"}
      </div>

      <div className="absolute bottom-4 left-4 right-4 text-white md:bottom-6 md:left-6">
        <h2 className="max-w-xl text-2xl font-extrabold leading-tight md:text-4xl">{activeSlide?.title}</h2>
        <p className="mt-2 max-w-xl text-sm text-slate-200 md:text-base">{activeSlide?.subtitle}</p>
        <button
          type="button"
          onClick={() => onSlideAction(activeSlide)}
          className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
        >
          {activeSlide?.ctaText || "Shop now"}
        </button>
      </div>

      <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
        {slides.map((slide, index) => (
          <button
            key={slide.id || index}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to banner ${index + 1}`}
            className={`h-2.5 rounded-pill transition ${index === activeIndex ? "w-6 bg-white" : "w-2.5 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
