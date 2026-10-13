import gsap from 'gsap';
import { shouldAnimate, MOTION_CONFIG } from './config';

export const slideDrawerIn = (drawerElement, backdropElement) => {
  if (!shouldAnimate()) return;

  const tl = gsap.timeline();

  if (backdropElement) {
    tl.fromTo(backdropElement, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' }, 0);
  }

  if (drawerElement) {
    tl.fromTo(
      drawerElement,
      { x: '100%' },
      { x: '0%', duration: MOTION_CONFIG.duration.base, ease: MOTION_CONFIG.ease.smooth },
      0
    );
  }

  return tl;
};

export const slideDrawerOut = (drawerElement, backdropElement, onComplete) => {
  if (!shouldAnimate()) {
    if (onComplete) onComplete();
    return;
  }

  const tl = gsap.timeline({ onComplete });

  if (backdropElement) {
    tl.to(backdropElement, { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0);
  }

  if (drawerElement) {
    tl.to(drawerElement, { x: '100%', duration: 0.25, ease: 'power2.in' }, 0);
  }

  return tl;
};
