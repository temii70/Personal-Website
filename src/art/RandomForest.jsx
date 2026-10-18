import useCanvas from "./useCanvas";
import { rng, pick, prefersReducedMotion } from "./random";
import { palette } from "../theme";

// A random forest, literally: a row of decision trees that grow in on load. Every split is
// binary, every split node is a small knot, and every leaf is a vote, coloured by class.

const VOTES = [palette.pink, palette.blue, palette.blue, palette.yellow, palette.moss];
const DURATION = 3000;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

function buildForest(width, height) {
  const rand = rng("forest");
  const segments = [];
  const knots = [];
  const leaves = [];
  const depth = width < 640 ? 6 : 7;
  const count = Math.max(3, Math.round(width / 230));

  function split(x, y, angle, len, d, order) {
    const bend = (rand() - 0.5) * 0.3;
    const x2 = x + Math.cos(angle) * len;
    const y2 = y + Math.sin(angle) * len;
    const cx = x + Math.cos(angle + bend) * len * 0.5;
    const cy = y + Math.sin(angle + bend) * len * 0.5;
    segments.push({ x, y, cx, cy, x2, y2, width: 0.4 + d * 0.28, order });

    // stop early now and then, like a tree with a max-depth or min-samples rule
    if (d === 0 || (d < 3 && rand() < 0.18)) {
      leaves.push({ x: x2, y: y2, order: order + 1, r: 1.8 + rand() * 1.6, color: pick(rand, VOTES) });
      return;
    }
    knots.push({ x: x2, y: y2, order: order + 1 });
    const towardSky = (-Math.PI / 2 - angle) * 0.1;
    const spread = 0.3 + rand() * 0.28;
    split(x2, y2, angle - spread + towardSky, len * (0.7 + rand() * 0.12), d - 1, order + 1);
    split(x2, y2, angle + spread + towardSky, len * (0.7 + rand() * 0.12), d - 1, order + 1);
  }

  for (let i = 0; i < count; i++) {
    const x = ((i + 0.5) / count) * width + (rand() - 0.5) * 80;
    split(x, height + 4, -Math.PI / 2 + (rand() - 0.5) * 0.4, height * (0.16 + rand() * 0.1), depth, 0);
  }
  return { segments, knots, leaves, slot: DURATION / (depth + 2) };
}

function drawForest(ctx, width, height) {
  const { segments, knots, leaves, slot } = buildForest(width, height);
  let start;
  let raf;

  const render = (t) => {
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(90, 82, 74, 0.75)";
    for (const s of segments) {
      const f = clamp01((t - s.order * slot) / slot);
      if (!f) continue;
      // de Casteljau split so a branch can be partly grown
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
    ctx.fillStyle = "rgba(90, 82, 74, 0.6)";
    for (const k of knots) {
      if (t < k.order * slot) continue;
      ctx.beginPath();
      ctx.arc(k.x, k.y, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const l of leaves) {
      const f = clamp01((t - l.order * slot) / (slot * 1.4));
      if (!f) continue;
      ctx.fillStyle = l.color;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.r * f, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = l.color;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.arc(l.x, l.y, (l.r + 2.4) * f, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(90, 82, 74, 0.75)";
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

export default function RandomForest({ className = "" }) {
  const ref = useCanvas(drawForest);
  return <canvas ref={ref} className={className} aria-hidden />;
}
