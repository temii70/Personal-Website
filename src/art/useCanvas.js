import { useEffect, useRef } from "react";

// Sizes a canvas to its CSS box (crisp on retina) and runs `draw(ctx, width, height, canvas)`.
// `draw` may return a cleanup function and re-runs whenever the canvas changes size.
// Canvases should have a fixed CSS height (not vh) so the mobile URL bar doesn't restart the art.
// `draw` must be defined outside the component so its identity is stable.
export default function useCanvas(draw) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let cleanup;
    let last = "";

    const setup = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const key = `${Math.round(width)}x${Math.round(height)}`;
      if (!width || !height || key === last) return;
      last = key;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cleanup?.();
      cleanup = draw(ctx, width, height, canvas);
    };

    setup();
    const observer = new ResizeObserver(setup);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      cleanup?.();
    };
  }, [draw]);

  return ref;
}
