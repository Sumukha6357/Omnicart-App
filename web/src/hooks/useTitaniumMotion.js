import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';

/**
 * 🧲 useMagneticPull
 * Provides a magnetic attraction effect for interactive elements.
 */
export const useMagneticPull = (strength = 0.3) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, x: springX, y: springY, handleMouseMove, handleMouseLeave };
};

/**
 * 📐 useTitanium3DTilt
 * Computes rotation values based on cursor position relative to element center.
 */
export const useTitanium3DTilt = (maxRotation = 12) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [maxRotation, -maxRotation]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-maxRotation, maxRotation]);

  const onMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave };
};

/**
 * 🔦 useSpotlightMask
 * Updates CSS variables --mouse-x/y for radial gradient spotlights.
 */
export const useSpotlightMask = () => {
  const ref = useRef(null);

  useEffect(() => {
    const handleMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      ref.current.style.setProperty('--mouse-x', `${x}%`);
      ref.current.style.setProperty('--mouse-y', `${y}%`);
    };

    const target = ref.current;
    target?.addEventListener('mousemove', handleMove);
    return () => target?.removeEventListener('mousemove', handleMove);
  }, []);

  return ref;
};
