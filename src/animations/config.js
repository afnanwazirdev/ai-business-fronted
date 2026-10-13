// Global animation configuration
export const ENABLE_ANIMATIONS = true;

export const MOTION_CONFIG = {
  duration: {
    fast: 0.25,
    base: 0.5,
    slow: 0.8,
  },
  ease: {
    smooth: 'power3.out',
    snappy: 'power2.out',
    bounce: 'back.out(1.4)',
    inOut: 'power2.inOut',
  },
};

export const shouldAnimate = () => {
  if (!ENABLE_ANIMATIONS) return false;
  if (typeof window === 'undefined') return false;
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return !mediaQuery.matches;
};
