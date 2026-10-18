import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { rng } from "./random";
import { palette } from "../theme";

// A sampler of tiny models: a framed grid of small generative pencil drawings, one idea per
// tile. Each tile is drawn in a 100×100 box from a seed, so it looks the same on every visit.

const INK = palette.ink;
const f = (v) => +v.toFixed(1);
const gauss = (rand) => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
const ring = (cx, cy, rx, ry = rx) => `M${f(cx - rx)},${f(cy)} a${f(rx)},${f(ry)} 0 1,0 ${f(rx * 2)},0 a${f(rx)},${f(ry)} 0 1,0 ${f(-rx * 2)},0`;
const cross = (x, y, s = 2.6) => `M${f(x - s)},${f(y - s)} l${s * 2},${s * 2} M${f(x + s)},${f(y - s)} l${-s * 2},${s * 2}`;

// k-means: three clusters and their centroids
function kmeans(rand) {
  const centres = [[30, 34, palette.pink], [70, 30, palette.blue], [50, 72, palette.moss]];
  const dots = centres.flatMap(([cx, cy, c]) =>
    Array.from({ length: 16 }, () => ({ x: f(cx + gauss(rand) * 7), y: f(cy + gauss(rand) * 7), r: 1.3, c }))
  );
  const lines = centres.map(([cx, cy, c]) => ({ d: ring(cx, cy, 15), c, dash: "2 3" }));
  centres.forEach(([cx, cy]) => lines.push({ d: cross(cx, cy, 3), c: INK, w: 1.2 }));
  return { dots, lines };
}

// a straight line between two classes
function linear(rand) {
  const dots = [];
  const lines = [{ d: "M10,88 L90,12", c: INK, dash: "3 3" }];
  for (let i = 0; i < 22; i++) {
    const x = 8 + rand() * 84;
    const y = 8 + rand() * 84;
    if (Math.abs(x + y - 100) < 10) continue;
    if (x + y < 100) lines.push({ d: cross(x, y, 2), c: palette.blue, w: 0.9 });
    else dots.push({ x: f(x), y: f(y), r: 2.2, c: palette.pink, hollow: true });
  }
  return { dots, lines };
}

// the kernel trick: one class inside a ring of the other
function kernel(rand) {
  const dots = [];
  const lines = [{ d: ring(50, 50, 24), c: INK, dash: "3 3" }];
  for (let i = 0; i < 34; i++) {
    const a = rand() * Math.PI * 2;
    const inner = i < 12;
    const r = inner ? rand() * 14 : 32 + rand() * 12;
    const x = 50 + Math.cos(a) * r;
    const y = 50 + Math.sin(a) * r;
    if (inner) dots.push({ x: f(x), y: f(y), r: 1.6, c: palette.pink });
    else lines.push({ d: cross(x, y, 1.8), c: palette.blue, w: 0.9 });
  }
  return { dots, lines };
}

// gradient descent on a bowl: contours and a zig-zag walk to the bottom
function descent(rand) {
  const lines = [10, 20, 30, 40].map((r) => ({ d: ring(52, 52, r * 1.15, r * 0.7), c: palette.blue, dash: "2 3", w: 0.8 }));
  let x = 12;
  let y = 30;
  const steps = [[x, y]];
  for (let i = 0; i < 9; i++) {
    x += (52 - x) * 0.35 + (rand() - 0.5) * 4;
    y += (52 - y) * 0.35 + (i % 2 ? 8 : -8) * (1 - i / 9);
    steps.push([x, y]);
  }
  lines.push({ d: steps.map(([a, b], i) => `${i ? "L" : "M"}${f(a)},${f(b)}`).join(""), c: palette.pink, w: 1.1 });
  return { lines, dots: steps.map(([a, b]) => ({ x: f(a), y: f(b), r: 1.4, c: palette.pink })) };
}

// attention: a grid of weights, heavier near the diagonal
function attention(rand) {
  const dots = [];
  const n = 8;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const w = Math.exp(-Math.abs(i - j) * 0.9) * (0.6 + rand() * 0.6);
      dots.push({ x: 16 + j * 9.7, y: 16 + i * 9.7, r: f(0.6 + w * 3), c: w > 0.7 ? palette.pink : INK, o: 0.35 + w * 0.5 });
    }
  }
  return { dots, lines: [] };
}

// a time series and its smoothed trend
function series(rand) {
  let v = 50;
  const raw = [];
  for (let x = 6; x <= 94; x += 2) {
    v += (rand() - 0.5) * 9 - (v - 50) * 0.08;
    raw.push([x, v + Math.sin(x / 7) * 8]);
  }
  const smooth = raw.map(([x], i) => {
    const win = raw.slice(Math.max(0, i - 4), i + 5);
    return [x, win.reduce((s, [, y]) => s + y, 0) / win.length];
  });
  const path = (pts) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${f(y)}`).join("");
  return { lines: [{ d: path(raw), c: palette.blue, w: 0.8 }, { d: path(smooth), c: palette.pink, w: 1.3, dash: "4 3" }], dots: [] };
}

// embeddings: three spiralling neighbourhoods
function embedding(rand) {
  const dots = [];
  [[32, 36, palette.blue], [68, 40, palette.pink], [48, 70, palette.yellow]].forEach(([cx, cy, c], k) => {
    for (let i = 0; i < 26; i++) {
      const t = i * 0.5 + k;
      const r = 1.5 + i * 0.55;
      dots.push({ x: f(cx + Math.cos(t) * r + (rand() - 0.5) * 2), y: f(cy + Math.sin(t) * r + (rand() - 0.5) * 2), r: 1.1, c });
    }
  });
  return { dots, lines: [] };
}

// dropout: a small network with a few neurons switched off
function dropout(rand) {
  const layers = [[30, 50, 70], [20, 40, 60, 80], [20, 40, 60, 80], [40, 60]];
  const xs = [14, 38, 62, 86];
  const off = new Set();
  layers.forEach((ys, l) => ys.forEach((y, i) => l > 0 && l < 3 && rand() < 0.3 && off.add(`${l}-${i}`)));
  const lines = [];
  for (let l = 0; l < layers.length - 1; l++) {
    layers[l].forEach((y1, i) =>
      layers[l + 1].forEach((y2, j) => {
        if (off.has(`${l}-${i}`) || off.has(`${l + 1}-${j}`)) return;
        lines.push({ d: `M${xs.at(l)},${y1} L${xs.at(l + 1)},${y2}`, c: INK, w: 0.4, o: 0.5 });
      })
    );
  }
  const dots = layers.flatMap((ys, l) =>
    ys.map((y, i) => (off.has(`${l}-${i}`) ? { x: xs.at(l), y, r: 3.4, c: palette.inkSoft, hollow: true, dash: true } : { x: xs.at(l), y, r: 3.4, c: l === 3 ? palette.pink : palette.blue }))
  );
  return { dots, lines };
}

const TILES = [
  { kind: kmeans, label: "k-means" },
  { kind: linear, label: "a line between" },
  { kind: kernel, label: "the kernel trick" },
  { kind: descent, label: "gradient descent" },
  { kind: attention, label: "attention" },
  { kind: series, label: "signal & trend" },
  { kind: embedding, label: "embeddings" },
  { kind: dropout, label: "dropout" },
];

function Tile({ tile, index, still }) {
  const { dots, lines } = useMemo(() => tile.kind(rng(`sampler-${tile.label}`)), [tile]);
  return (
    <motion.figure
      className="relative border-dashed border-ink/20 p-3 [&:not(:nth-child(4n))]:sm:border-r [&:nth-child(-n+4)]:sm:border-b max-sm:[&:nth-child(odd)]:border-r max-sm:[&:nth-child(-n+6)]:border-b"
      initial={still ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.12 }}
    >
      <svg viewBox="0 0 100 100" className="block w-full" fill="none" strokeLinecap="round" aria-hidden>
        {lines.map((l, i) => (
          <path key={i} d={l.d} stroke={l.c} strokeWidth={l.w || 1} strokeDasharray={l.dash} strokeOpacity={l.o ?? 0.85} />
        ))}
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={d.hollow ? "none" : d.c}
            stroke={d.hollow ? d.c : "none"}
            strokeDasharray={d.dash ? "1.5 1.5" : undefined}
            strokeWidth="0.9"
            opacity={d.o ?? 0.9}
          />
        ))}
      </svg>
      <figcaption className="mt-1 text-center font-hand text-base lowercase text-ink-soft">{tile.label}</figcaption>
    </motion.figure>
  );
}

export default function Sampler() {
  const still = useReducedMotion();
  return (
    <div className="relative border border-ink/25 p-2 sm:p-3">
      {/* small corner ticks, like a frame drawn by hand */}
      {["-left-1.5 -top-1.5", "-right-1.5 -top-1.5", "-bottom-1.5 -left-1.5", "-bottom-1.5 -right-1.5"].map((pos) => (
        <span key={pos} aria-hidden className={`absolute h-3 w-3 border border-ink/40 bg-paper ${pos}`} />
      ))}
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {TILES.map((t, i) => (
          <Tile key={t.label} tile={t} index={i} still={still} />
        ))}
      </div>
    </div>
  );
}
