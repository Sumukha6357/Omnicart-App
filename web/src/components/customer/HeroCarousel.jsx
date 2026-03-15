import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMagneticPull } from "../../hooks/useTitaniumMotion";

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

const HERO_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1600&q=80";

export default function HeroCarousel({ ads = [], onSlideAction, locationLabel }) {
  const slides = useMemo(() => {
    const base = Array.isArray(ads) && ads.length > 0 ? ads : fallbackSlides;
    return base.map((slide, index) => ({
      id: slide.id || `slide-${index}`,
      title: slide.title || "Featured Deals",
      subtitle: slide.subtitle || "Discover fresh picks across categories.",
      imageUrl: slide.imageUrl || HERO_IMAGE_FALLBACK,
      ctaText: slide.ctaText || "Shop now",
      category: slide.category || "",
      ctaLink: slide.ctaLink || "/customer/home",
    }));
  }, [ads]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroSrc, setHeroSrc] = useState("");

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

  useEffect(() => {
    setHeroSrc(slides[activeIndex]?.imageUrl || HERO_IMAGE_FALLBACK);
  }, [activeIndex, slides]);

  const ctaMagnetic = useMagneticPull(0.2);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[activeIndex];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl dark:border-slate-800" aria-label="Hero promotions">
      <AnimatePresence mode="wait">
        <motion.img
          key={activeIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          src={heroSrc}
          alt={activeSlide?.title || "Offer banner"}
          onError={() => setHeroSrc(HERO_IMAGE_FALLBACK)}
          className="h-64 w-full object-cover md:h-96"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

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

      <div className="absolute bottom-6 left-6 right-6 text-white md:bottom-10 md:left-10">
        <motion.h2 
          key={`title-${activeIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl text-3xl font-extrabold leading-tight md:text-5xl"
        >
          {activeSlide?.title}
        </motion.h2>
        <motion.p 
          key={`sub-${activeIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 max-w-xl text-base text-slate-200 md:text-lg"
        >
          {activeSlide?.subtitle}
        </motion.p>
        <motion.button
          ref={ctaMagnetic.ref}
          onMouseMove={ctaMagnetic.handleMouseMove}
          onMouseLeave={ctaMagnetic.handleMouseLeave}
          style={{ x: ctaMagnetic.x, y: ctaMagnetic.y }}
          type="button"
          onClick={() => onSlideAction(activeSlide)}
          className="mt-6 inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition-transform active:scale-95"
        >
          {activeSlide?.ctaText || "Shop now"}
        </motion.button>
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
