import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { rng } from "./random";
import { palette } from "../theme";

// Small pen sketches that draw themselves in when scrolled into view.
// Each kind is generated from a seed: a maze, a spiral, a graph, a time series, an orbit.

const f = (v) => +v.toFixed(1);
const circle = (cx, cy, r) => `M${cx - r},${cy} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0`;
const sparkle = (x, y, s = 4) => `M${x - s},${y} h${s * 2} M${x},${y - s} v${s * 2}`;

function maze(rand) {
  const n = 6;
  const size = 84;
  const cell = size / n;
  const o = 8;
  const open = new Set();
  const key = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  const visited = new Set([0]);
  const stack = [0];

  // recursive backtracker
  while (stack.length) {
    const c = stack[stack.length - 1];
    const x = c % n;
    const y = Math.floor(c / n);
    const next = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].filter(
      ([a, b]) => a >= 0 && b >= 0 && a < n && b < n && !visited.has(b * n + a)
    );
    if (!next.length) {
      stack.pop();
      continue;
    }
    const [a, b] = next[Math.floor(rand() * next.length)];
    const nc = b * n + a;
    open.add(key(c, nc));
    visited.add(nc);
    stack.push(nc);
  }

  let d = `M${o + cell},${o} H${o + size} V${o + size} M${o + size - cell},${o + size} H${o} V${o}`;
  for (let c = 0; c < n * n; c++) {
    const x = c % n;
    const y = Math.floor(c / n);
    if (x < n - 1 && !open.has(key(c, c + 1))) d += ` M${f(o + (x + 1) * cell)},${f(o + y * cell)} v${f(cell)}`;
    if (y < n - 1 && !open.has(key(c, c + n))) d += ` M${f(o + x * cell)},${f(o + (y + 1) * cell)} h${f(cell)}`;
  }
  return { paths: [{ d }, { d: sparkle(o + size - cell / 2, o + size - cell / 2, 3), color: palette.rust }] };
}

function spiral(rand) {
  const turn = rand() * Math.PI * 2;
  let d = "";
  for (let t = 0; t <= 5.4 * Math.PI; t += 0.15) {
    const r = 2.4 * t;
    d += `${d ? "L" : "M"}${f(50 + Math.cos(t + turn) * r)},${f(50 + Math.sin(t + turn) * r)} `;
  }
  return { paths: [{ d, color: rand() < 0.5 ? palette.rust : palette.ink }], dots: [{ x: 50, y: 50, r: 1.4 }] };
}

function constellation(rand) {
  const pts = Array.from({ length: 8 }, () => [f(12 + rand() * 76), f(12 + rand() * 76)]);
  const inTree = [0];
  const paths = [];

  // minimum spanning tree (Prim's): connect every star with the shortest total line
  while (inTree.length < pts.length) {
    let best = null;
    for (const i of inTree) {
      for (let j = 0; j < pts.length; j++) {
        if (inTree.includes(j)) continue;
        const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
        if (!best || d < best.d) best = { i, j, d };
      }
    }
    inTree.push(best.j);
    paths.push({ d: `M${pts[best.i]} L${pts[best.j]}`, width: 0.8 });
  }
  paths.push({ d: sparkle(...pts[2]), color: palette.thread }, { d: sparkle(...pts[5], 3), color: palette.thread });
  return { paths, dots: pts.map(([x, y]) => ({ x, y, r: 1.5 })) };
}

function wave(rand) {
  const paths = [30, 50, 70].map((base, k) => {
    const freq = 0.12 + rand() * 0.08;
    const phase = rand() * 6;
    const amp = 5 + rand() * 5;
    let d = "";
    for (let x = 8; x <= 92; x += 3) {
      const y = base + Math.sin(x * freq + phase) * amp + (rand() - 0.5) * 2.5;
      d += `${d ? "L" : "M"}${x},${f(y)} `;
    }
    return { d, color: k === 2 ? palette.rust : palette.ink, width: k === 2 ? 1.2 : 0.8 };
  });
  return { paths };
}

function orbit(rand) {
  const tilt = -20 + rand() * 40;
  const paths = [
    { d: circle(50, 50, 14), width: 0.7 },
    { d: circle(50, 50, 26), width: 0.7 },
    { d: circle(50, 50, 38), width: 0.7 },
    { d: `M10,50 a40,15 0 1,0 80,0 a40,15 0 1,0 -80,0`, transform: `rotate(${f(tilt)} 50 50)`, width: 1.1 },
    { d: "M14,86 L82,22", color: palette.thread, width: 0.8 },
  ];
  const dots = [
    { x: 50, y: 50, r: 3, color: palette.thread },
    { x: f(50 + 26 * Math.cos(rand() * 6)), y: f(50 + 26 * Math.sin(rand() * 6)), r: 2 },
    { x: 82, y: 22, r: 1.8, color: palette.rust },
  ];
  return { paths, dots };
}

const KINDS = { maze, spiral, constellation, wave, orbit };

const drawIn = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => ({ pathLength: 1, opacity: 1, transition: { duration: 1.4, delay: i * 0.06, ease: "easeInOut" } }),
};
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.9 } } };

export default function Doodle({ kind, seed = kind, className = "h-20 w-20" }) {
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
      {paths.map((p, i) => (
        <motion.path key={i} d={p.d} transform={p.transform} stroke={p.color || palette.ink} strokeWidth={p.width || 1.1} variants={drawIn} custom={i} />
      ))}
      {dots.map((d, i) => (
        <motion.circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.color || palette.ink} variants={fadeIn} />
      ))}
    </motion.svg>
  );
}
