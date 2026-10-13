import gsap from 'gsap';
import { shouldAnimate, MOTION_CONFIG } from './config';

export const pageEnter = (container, onComplete) => {
  if (!shouldAnimate() || !container) {
    if (onComplete) onComplete();
    return;
  }

  return gsap.fromTo(
    container,
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      duration: MOTION_CONFIG.duration.fast,
      ease: MOTION_CONFIG.ease.snappy,
      onComplete,
    }
  );
};

export const pageExit = (container, onComplete) => {
  if (!shouldAnimate() || !container) {
    if (onComplete) onComplete();
    return;
  }

  return gsap.to(container, {
    opacity: 0,
    y: -8,
    duration: 0.2,
    ease: 'power2.in',
    onComplete,
  });
};
