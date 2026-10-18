import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { rng } from "./random";
import { palette } from "../theme";

// Tiny sketches, one per project, each sketching the idea behind it.
// Lines draw themselves in; points fade in after.

const f = (v) => +v.toFixed(1);
const xMark = (x, y, s = 2.6) => `M${f(x - s)},${f(y - s)} L${f(x + s)},${f(y + s)} M${f(x + s)},${f(y - s)} L${f(x - s)},${f(y + s)}`;
const ring = (cx, cy, r) => `M${f(cx - r)},${f(cy)} a${f(r)},${f(r)} 0 1,0 ${f(r * 2)},0 a${f(r)},${f(r)} 0 1,0 ${f(-r * 2)},0`;

// RAG retrieval: a query in embedding space and its nearest neighbours
function knn(rand) {
  const pts = Array.from({ length: 28 }, () => ({ x: 8 + rand() * 84, y: 8 + rand() * 84 }));
  const q = { x: 52, y: 46 };
  const near = [...pts].sort((a, b) => Math.hypot(a.x - q.x, a.y - q.y) - Math.hypot(b.x - q.x, b.y - q.y)).slice(0, 5);
  const radius = Math.hypot(near[4].x - q.x, near[4].y - q.y) + 3;
  return {
    paths: [
      { d: ring(q.x, q.y, radius), color: palette.signal, width: 0.8, dash: "2 3" },
      ...near.map((p) => ({ d: `M${q.x},${q.y} L${f(p.x)},${f(p.y)}`, color: palette.signal, width: 0.7 })),
      { d: xMark(q.x, q.y, 3.4), color: palette.signal, width: 1.4 },
    ],
    dots: pts.map((p) => ({ x: f(p.x), y: f(p.y), r: near.includes(p) ? 2 : 1.4, color: near.includes(p) ? palette.ink : palette.pen })),
  };
}

// Lottery: a grid of entries, a few drawn at random and circled
function lottery(rand) {
  const cells = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) cells.push({ x: 15 + c * 14, y: 20 + r * 15 });
  const winners = new Set();
  while (winners.size < 4) winners.add(Math.floor(rand() * cells.length));
  return {
    paths: [...winners].map((i) => ({ d: ring(cells[i].x + (rand() - 0.5), cells[i].y, 5.5), color: palette.signal, width: 1.1 })),
    dots: cells.map((c, i) => ({ x: c.x, y: c.y, r: 2.4, color: winners.has(i) ? palette.signal : palette.pen, hollow: !winners.has(i) })),
  };
}

// CNN: a 3×3 kernel sliding over a pixel smiley
function kernel() {
  const face = ["0011100", "0100010", "1010101", "1000001", "1011101", "0100010", "0011100"];
  const s = 9;
  const o = 14;
  const paths = [{ d: `M${o},${o} h${s * 7} v${s * 7} h${-s * 7} Z`, width: 0.6 }];
  for (let i = 1; i < 7; i++) paths.push({ d: `M${o + i * s},${o} v${s * 7} M${o},${o + i * s} h${s * 7}`, width: 0.3 });
  paths.push({ d: `M${o + s},${o + 2 * s} h${s * 3} v${s * 3} h${-s * 3} Z`, color: palette.signal, width: 1.4 });
  paths.push({ d: `M${o + 4 * s + 2},${o + 3.5 * s} C ${o + 6 * s},${o + 2 * s} 84,${o + 2 * s} 86,${o + 3.2 * s}`, color: palette.signal, width: 0.9 });
  const dots = [];
  face.forEach((row, y) => [...row].forEach((v, x) => v === "1" && dots.push({ x: o + x * s + s / 2, y: o + y * s + s / 2, r: 3.2, color: palette.ink, square: true })));
  dots.push({ x: 86, y: o + 3.5 * s + 3, r: 3, color: palette.signal, square: true });
  return { paths, dots };
}

// SVM: two classes, a separating line, its margins, and the support vectors
function svm(rand) {
  const a = Array.from({ length: 9 }, () => ({ x: 10 + rand() * 38, y: 52 + rand() * 38 }));
  const b = Array.from({ length: 9 }, () => ({ x: 52 + rand() * 38, y: 10 + rand() * 38 }));
  return {
    paths: [
      { d: "M8,92 L92,8", width: 1.1 },
      { d: "M8,78 L78,8", width: 0.7, dash: "3 3" },
      { d: "M22,92 L92,22", width: 0.7, dash: "3 3" },
      ...a.map((p) => ({ d: xMark(p.x, p.y), width: 1 })),
      { d: ring(a[0].x, a[0].y, 5) + ring(b[0].x, b[0].y, 5), color: palette.signal, width: 0.9 },
    ],
    dots: b.map((p) => ({ x: f(p.x), y: f(p.y), r: 2.6, color: palette.pen, hollow: true })),
  };
}

// Basketball: a shot arc into the hoop
function arc() {
  const pts = [];
  for (let t = 0; t <= 1.0001; t += 0.1) pts.push({ x: 12 + t * 64, y: 80 - 150 * t + 120 * t * t });
  return {
    paths: [
      { d: `M12,80 Q44,-10 76,50`, width: 0.8, dash: "2 4", color: palette.pen },
      { d: "M86,26 v34", width: 1.4 },
      { d: "M72,46 h14", width: 1.4, color: palette.signal },
      { d: "M73,46 l3,12 h6 l3,-12", width: 0.6 },
      { d: "M8,92 h84", width: 0.6 },
    ],
    dots: [...pts.slice(0, -1).map((p, i) => ({ x: f(p.x), y: f(p.y), r: 0.8 + i * 0.12, color: palette.pen })), { x: 76, y: 50, r: 4, color: palette.signal }],
  };
}

const KINDS = { knn, lottery, kernel, svm, arc };

const drawIn = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => ({ pathLength: 1, opacity: 1, transition: { duration: 1.1, delay: 0.3 + i * 0.04, ease: "easeInOut" } }),
};
const fadeIn = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.012 } }),
};

export default function Figure({ kind, seed = kind, className = "h-24 w-24" }) {
  const { paths, dots = [] } = useMemo(() => KINDS[kind](rng(seed)), [kind, seed]);
  const still = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={still ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      aria-hidden
    >
      {dots.map((d, i) =>
        d.square ? (
          <motion.rect key={i} x={d.x - d.r} y={d.y - d.r} width={d.r * 2} height={d.r * 2} fill={d.color} opacity={0.8} variants={fadeIn} custom={i} />
        ) : (
          <motion.circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={d.hollow ? "none" : d.color}
            stroke={d.hollow ? d.color : "none"}
            strokeWidth="1"
            variants={fadeIn}
            custom={i}
          />
        )
      )}
      {paths.map((p, i) => (
        <motion.path
          key={i}
          d={p.d}
          stroke={p.color || palette.ink}
          strokeWidth={p.width || 1}
          strokeDasharray={p.dash}
          variants={p.dash ? fadeIn : drawIn}
          custom={i}
        />
      ))}
    </motion.svg>
  );
}
