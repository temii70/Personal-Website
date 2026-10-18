import useCanvas from "./useCanvas";
import { rng, prefersReducedMotion } from "./random";

// Boids: every bird only follows three local rules (don't crowd, match heading, stay close),
// yet the whole flock moves as one. Birds scatter away from the cursor.

function drawFlock(ctx, width, height, canvas) {
  const rand = rng("flock");
  const n = width < 640 ? 170 : 380;
  const birds = Array.from({ length: n }, () => ({
    x: width * (0.1 + rand() * 0.3),
    y: height * (0.15 + rand() * 0.3),
    vx: 1 + rand(),
    vy: rand() - 0.5,
    flap: rand() * 6,
  }));
  const pointer = { x: -1e4, y: -1e4 };
  let time = 0;
  let raf;
  let visible = false;

  const step = () => {
    time += 0.0035;
    // a slow figure-eight the flock drifts after, so it sweeps across the canvas
    const ax = width * (0.5 + 0.36 * Math.sin(time));
    const ay = height * (0.38 + 0.18 * Math.sin(time * 2));

    for (const b of birds) {
      let sx = 0, sy = 0, mx = 0, my = 0, cx = 0, cy = 0, count = 0;
      for (const o of birds) {
        if (o === b) continue;
        const dx = o.x - b.x;
        const dy = o.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > 900) continue;
        count++;
        mx += o.vx; my += o.vy;
        cx += o.x; cy += o.y;
        if (d2 < 64) {
          sx -= dx / (d2 || 1);
          sy -= dy / (d2 || 1);
        }
      }
      if (count) {
        b.vx += (mx / count - b.vx) * 0.05 + (cx / count - b.x) * 0.002;
        b.vy += (my / count - b.vy) * 0.05 + (cy / count - b.y) * 0.002;
      }
      b.vx += sx * 0.6 + (ax - b.x) * 0.0006;
      b.vy += sy * 0.6 + (ay - b.y) * 0.0006;

      const px = b.x - pointer.x;
      const py = b.y - pointer.y;
      const pd = Math.hypot(px, py);
      if (pd < 90) {
        b.vx += (px / (pd + 1)) * 0.7;
        b.vy += (py / (pd + 1)) * 0.7;
      }

      const speed = Math.hypot(b.vx, b.vy);
      const clamped = Math.min(2.6, Math.max(1.2, speed));
      b.vx *= clamped / speed;
      b.vy *= clamped / speed;
      b.x += b.vx;
      b.y += b.vy;
      b.flap += 0.25;
    }
  };

  const render = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(43, 38, 32, 0.72)";
    ctx.lineWidth = 0.9;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (const b of birds) {
      const heading = Math.atan2(b.vy, b.vx) + Math.PI;
      const wing = 0.75 + Math.sin(b.flap) * 0.25;
      const s = 3.2;
      ctx.moveTo(b.x + Math.cos(heading - wing) * s, b.y + Math.sin(heading - wing) * s);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(b.x + Math.cos(heading + wing) * s, b.y + Math.sin(heading + wing) * s);
    }
    ctx.stroke();
  };

  if (prefersReducedMotion()) {
    for (let i = 0; i < 400; i++) step();
    render();
    return;
  }

  const frame = () => {
    step();
    render();
    if (visible) raf = requestAnimationFrame(frame);
  };

  // only simulate while the flock is on screen
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(frame);
  });
  observer.observe(canvas);

  const onMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  };
  const onLeave = () => {
    pointer.x = pointer.y = -1e4;
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);

  return () => {
    observer.disconnect();
    cancelAnimationFrame(raf);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerleave", onLeave);
  };
}

export default function Murmuration({ className = "" }) {
  const ref = useCanvas(drawFlock);
  return <canvas ref={ref} className={className} aria-hidden />;
}
