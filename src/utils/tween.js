/**
 * Lightweight tweening engine — no dependencies
 * Supports: linear, easeOut, easeInOut, easeOutBounce, easeOutElastic, easeOutBack
 */

const EASINGS = {
  linear: t => t,
  easeOut: t => 1 - Math.pow(1 - t, 3),
  easeInOut: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutBounce: t => {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
  easeOutElastic: t => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeOutBack: t => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};

export function tween(options) {
  const {
    from = {},
    to = {},
    duration = 1000,
    ease = 'easeOut',
    onUpdate,
    onComplete,
    delay = 0,
  } = options;

  const easingFn = EASINGS[ease] || EASINGS.easeOut;
  const startTime = performance.now() + delay;
  const keys = Object.keys(to);
  let rafId = null;
  let isRunning = true;

  const tick = (now) => {
    if (!isRunning) return;
    if (now < startTime) {
      rafId = requestAnimationFrame(tick);
      return;
    }
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easingFn(progress);
    const current = {};
    for (const key of keys) {
      const startVal = from[key] ?? 0;
      const endVal = to[key];
      current[key] = startVal + (endVal - startVal) * eased;
    }
    if (onUpdate) onUpdate(current, progress);
    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      isRunning = false;
      if (onComplete) onComplete();
    }
  };

  rafId = requestAnimationFrame(tick);

  return {
    stop() {
      isRunning = false;
      if (rafId) cancelAnimationFrame(rafId);
    },
    isRunning: () => isRunning,
  };
}

export function shake(entity, intensity = 10, duration = 400) {
  const originalX = entity.x;
  const startTime = performance.now();
  let rafId = null;

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    if (progress < 1) {
      const decay = 1 - progress;
      entity.x = originalX + Math.sin(progress * Math.PI * 8) * intensity * decay;
      rafId = requestAnimationFrame(tick);
    } else {
      entity.x = originalX;
    }
  };

  rafId = requestAnimationFrame(tick);
  return { stop() { if (rafId) cancelAnimationFrame(rafId); entity.x = originalX; } };
}

export function pulse(entity, scaleAmount = 0.2, duration = 600) {
  const originalScale = entity.scale || 1;
  return tween({
    from: { scale: originalScale },
    to: { scale: originalScale + scaleAmount },
    duration: duration / 2,
    ease: 'easeOut',
    onUpdate: ({ scale }) => { entity.scale = scale; },
    onComplete: () => {
      tween({
        from: { scale: originalScale + scaleAmount },
        to: { scale: originalScale },
        duration: duration / 2,
        ease: 'easeInOut',
        onUpdate: ({ scale }) => { entity.scale = scale; },
      });
    },
  });
}

export function float(entity, amplitude = 5, speed = 2) {
  const baseY = entity.y;
  let rafId = null;
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = (now - startTime) / 1000;
    entity.y = baseY + Math.sin(elapsed * speed) * amplitude;
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
  return { stop() { if (rafId) cancelAnimationFrame(rafId); entity.y = baseY; } };
}
