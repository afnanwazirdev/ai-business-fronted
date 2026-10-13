import gsap from 'gsap';
import { shouldAnimate, MOTION_CONFIG } from './config';

export const staggerIn = (targets, options = {}) => {
  if (!shouldAnimate() || !targets) return;

  const {
    delay = 0.05,
    duration = MOTION_CONFIG.duration.base,
    ease = MOTION_CONFIG.ease.smooth,
    stagger = 0.06,
    scale = 0.96,
    y = 16,
    onComplete,
  } = options;

  return gsap.fromTo(
    targets,
    { opacity: 0, scale, y },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease,
      clearProps: 'transform,opacity',
      onComplete,
    }
  );
};
