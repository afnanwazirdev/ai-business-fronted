import gsap from 'gsap';
import { shouldAnimate, MOTION_CONFIG } from './config';

export const countUp = (targetElement, endValue, options = {}) => {
  if (!targetElement) return;

  const {
    duration = 1.2,
    prefix = '',
    suffix = '',
    decimals = 0,
    ease = MOTION_CONFIG.ease.smooth,
  } = options;

  if (!shouldAnimate()) {
    targetElement.textContent = `${prefix}${endValue.toLocaleString('en-PK', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
    return;
  }

  const state = { val: 0 };
  return gsap.to(state, {
    val: endValue,
    duration,
    ease,
    onUpdate: () => {
      targetElement.textContent = `${prefix}${Math.round(state.val).toLocaleString('en-PK', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;
    },
  });
};
