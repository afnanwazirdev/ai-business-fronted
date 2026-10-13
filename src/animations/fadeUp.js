import gsap from 'gsap';
import { shouldAnimate, MOTION_CONFIG } from './config';

export const fadeUp = (targets, options = {}) => {
  if (!shouldAnimate() || !targets) return;

  const {
    delay = 0,
    duration = MOTION_CONFIG.duration.base,
    ease = MOTION_CONFIG.ease.smooth,
    y = 24,
    opacity = 0,
    stagger = 0.08,
    onComplete,
  } = options;

  return gsap.fromTo(
    targets,
    { y, opacity },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease,
      stagger,
      clearProps: 'transform,opacity',
      onComplete,
    }
  );
};
