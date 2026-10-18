import useCanvas from "./useCanvas";
import { rng, prefersReducedMotion } from "./random";
import { palette } from "../theme";

// Noise → signal. Hundreds of dots start as pure noise and are "denoised" step by step
// (like a diffusion model) until they settle onto a heartbeat trace. Moving through them
// adds noise back locally, and they find their way home again.

// One heartbeat, p in [0, 1): P wave, QRS spike, T wave as sums of gaussians.
function heartbeat(p) {
  const g = (mu, s, a) => a * Math.exp(-((p - mu) ** 2) / (2 * s * s));
  return g(0.18, 0.025, 0.12) - g(0.36, 0.008, 0.12) + g(0.4, 0.01, 1) - g(0.44, 0.01, 0.25) + g(0.66, 0.045, 0.28);
}

const DENOISE_MS = 2800;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function drawSignal(ctx, width, height, canvas) {
  const rand = rng("signal");
  const gauss = () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());

  // a whole number of beats, so the trace starts and ends on the baseline where the page line meets it
  const period = width / Math.max(2, Math.round(width / 210));
  const mid = height * 0.66;
  const amp = height * 0.55;
  const n = Math.round(width / 3);
  const dots = Array.from({ length: n }, (_, i) => {
    const tx = ((i + 0.5) / n) * width;
    return { tx, ty: mid - amp * heartbeat((tx / period + 0.15) % 1), ex: gauss(), ey: gauss(), local: 0, s: 1, x: 0, y: 0 };
  });
  const pointer = { x: -1e4, y: -1e4 };
  let start;
  let raf;
  let visible = false;

  const render = (elapsed) => {
    const scheduled = 1 - easeInOut(Math.min(1, elapsed / DENOISE_MS));
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = palette.ink;
    ctx.globalAlpha = 0.7;
    for (const d of dots) {
      const dist = Math.hypot(d.x - pointer.x, d.y - pointer.y);
      if (dist < 70) d.local = Math.max(d.local, 0.8 * (1 - dist / 70));
      d.local *= 0.965;
      d.ex += (gauss() - d.ex) * 0.02;
      d.ey += (gauss() - d.ey) * 0.02;
      d.s = Math.max(scheduled, d.local);
      d.x = d.tx + d.s * d.ex * 50;
      d.y = d.ty + d.s * d.ey * height * 0.35;
      ctx.fillRect(d.x - 0.7, d.y - 0.7, 1.4, 1.4);
    }
    ctx.globalAlpha = 1;

    // ink the trace wherever neighbouring dots have settled: in slate pencil
    ctx.lineWidth = 1.6;
    ctx.lineJoin = "round";
    for (const [color, off, alpha] of [[palette.misprint, 0, 0], [palette.blue, 0, 1]]) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      for (let i = 1; i < n; i++) {
        const a = dots[i - 1];
        const b = dots[i];
        if (a.s < 0.06 && b.s < 0.06) {
          ctx.moveTo(a.x + off, a.y + off);
          ctx.lineTo(b.x + off, b.y + off);
        }
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // a monitor sweep running along the finished trace
    if (scheduled === 0) {
      const head = dots[Math.floor((elapsed / 6) % n)];
      if (head.s < 0.06) {
        ctx.fillStyle = palette.signal;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  if (prefersReducedMotion()) {
    render(DENOISE_MS);
    return;
  }

  const frame = (now) => {
    start ??= now;
    render(now - start);
    if (visible) raf = requestAnimationFrame(frame);
  };

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

export default function Signal({ className = "" }) {
  const ref = useCanvas(drawSignal);
  return <canvas ref={ref} className={className} aria-hidden />;
}
