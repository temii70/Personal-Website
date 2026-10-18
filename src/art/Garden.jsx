import useCanvas from "./useCanvas";
import { rng, pick, prefersReducedMotion } from "./random";
import { palette } from "../theme";

// Recursive branching plants (a loose L-system) that grow in when the page loads.

const BLOOM_COLORS = [palette.rust, palette.thread, palette.moss, "#d49a7a"];
const DURATION = 2800;

function buildGarden(width, height) {
  const rand = rng("garden");
  const segments = [];
  const blooms = [];
  const depth = width < 640 ? 6 : 7;
  const count = Math.max(2, Math.round(width / 260));

  function branch(x, y, angle, len, d, order) {
    const bend = (rand() - 0.5) * 0.35;
    const x2 = x + Math.cos(angle) * len;
    const y2 = y + Math.sin(angle) * len;
    const cx = x + Math.cos(angle + bend) * len * 0.5;
    const cy = y + Math.sin(angle + bend) * len * 0.5;
    segments.push({ x, y, cx, cy, x2, y2, width: 0.45 + d * 0.3, order });

    if (d === 0 || (d < 3 && rand() < 0.12)) {
      blooms.push({ x: x2, y: y2, order: order + 1, size: 2.5 + rand() * 3, color: pick(rand, BLOOM_COLORS), spin: rand() * Math.PI });
      return;
    }

    const kids = rand() < 0.75 ? 2 : 3;
    for (let k = 0; k < kids; k++) {
      const spread = kids === 2 ? (k ? 1 : -1) * (0.22 + rand() * 0.3) : (k - 1) * (0.35 + rand() * 0.2);
      const towardSky = (-Math.PI / 2 - angle) * 0.08;
      branch(x2, y2, angle + spread + towardSky + (rand() - 0.5) * 0.15, len * (0.7 + rand() * 0.12), d - 1, order + 1);
    }
  }

  for (let i = 0; i < count; i++) {
    const x = ((i + 0.5) / count) * width + (rand() - 0.5) * 90;
    branch(x, height + 4, -Math.PI / 2 + (rand() - 0.5) * 0.45, height * (0.17 + rand() * 0.1), depth, 0);
  }

  return { segments, blooms, slot: DURATION / (depth + 2) };
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function drawBloom(ctx, b, f) {
  ctx.strokeStyle = b.color;
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = b.spin + (i / 6) * Math.PI * 2;
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x + Math.cos(a) * b.size * f, b.y + Math.sin(a) * b.size * f);
  }
  ctx.stroke();
}

function drawGarden(ctx, width, height) {
  const { segments, blooms, slot } = buildGarden(width, height);
  let start;
  let raf;

  const render = (t) => {
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(92, 82, 72, 0.7)";
    for (const s of segments) {
      const f = clamp01((t - s.order * slot) / slot);
      if (!f) continue;
      // de Casteljau split so a branch can be partially drawn
      const qx = s.x + (s.cx - s.x) * f;
      const qy = s.y + (s.cy - s.y) * f;
      const ex = (1 - f) ** 2 * s.x + 2 * (1 - f) * f * s.cx + f * f * s.x2;
      const ey = (1 - f) ** 2 * s.y + 2 * (1 - f) * f * s.cy + f * f * s.y2;
      ctx.lineWidth = s.width;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.quadraticCurveTo(qx, qy, ex, ey);
      ctx.stroke();
    }
    for (const b of blooms) {
      const f = clamp01((t - b.order * slot) / (slot * 1.5));
      if (f) drawBloom(ctx, b, f);
    }
  };

  if (prefersReducedMotion()) {
    render(Infinity);
    return;
  }

  const frame = (now) => {
    start ??= now;
    render(now - start);
    if (now - start < DURATION + slot * 2) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

export default function Garden({ className = "" }) {
  const ref = useCanvas(drawGarden);
  return <canvas ref={ref} className={className} aria-hidden />;
}
