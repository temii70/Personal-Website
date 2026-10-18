import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { rng } from "./random";
import { palette } from "../theme";

// My own loss curve: noisy, mostly downhill, with the occasional spike.

const W = 340;
const H = 200;
const X0 = 36;
const Y0 = 168;

const NOTES = [
  { t: 0.03, text: "first CS class", dx: 8, dy: -6 },
  { t: 0.42, text: "first research project", dx: 10, dy: -14 },
  { t: 0.68, text: "learning kubernetes", dx: -40, dy: -22, spike: true },
  { t: 0.97, text: "now (still descending)", dx: -118, dy: -16 },
];

function loss(t, rand) {
  const spike = Math.exp(-((t - 0.68) ** 2) / 0.0008) * 0.35;
  return 0.12 + 0.85 * Math.exp(-3.2 * t) + spike + (rand() - 0.5) * 0.06 * (1 - t * 0.5);
}

export default function LearningCurve({ className = "" }) {
  const still = useReducedMotion();
  const { d, points } = useMemo(() => {
    const rand = rng("learning");
    const toXY = (t, v) => [X0 + t * (W - X0 - 12), Y0 - v * (Y0 - 16)];
    let path = "";
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      const [x, y] = toXY(t, loss(t, rand));
      path += `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)} `;
    }
    const noteRand = rng("learning-notes");
    return { d: path, points: NOTES.map((n) => ({ ...n, xy: toXY(n.t, loss(n.t, noteRand) - (n.spike ? 0 : 0.02)) })) };
  }, []);

  return (
    <motion.svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      initial={still ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      role="img"
      aria-label="A hand-drawn loss curve: noisy and mostly going down over time, with a spike at 'learning kubernetes'."
    >
      <g stroke={palette.ink} strokeWidth="1" fill="none">
        <path d={`M${X0},10 V${Y0} H${W - 6}`} />
        <path d={`M${W - 12},${Y0 - 4} L${W - 6},${Y0} L${W - 12},${Y0 + 4}`} />
        <path d={`M${X0 - 4},16 L${X0},10 L${X0 + 4},16`} />
      </g>
      <text x={W - 8} y={Y0 + 16} textAnchor="end" className="fill-ink-soft font-mono text-[9px]">
        time →
      </text>
      <text x="10" y={Y0 / 2 + 20} transform={`rotate(-90 10 ${Y0 / 2 + 20})`} className="fill-ink-soft font-mono text-[9px]">
        confusion
      </text>

      <motion.path
        d={d}
        fill="none"
        stroke={palette.pen}
        strokeWidth="1.4"
        strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 2.2, ease: "easeInOut" } } }}
      />

      {points.map((p, i) => (
        <motion.g key={p.text} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.5 + i * 0.45 } } }}>
          <circle cx={p.xy[0]} cy={p.xy[1]} r="2.4" fill={palette.signal} />
          <text x={p.xy[0] + p.dx} y={p.xy[1] + p.dy} className="fill-pen font-hand text-[12px]">
            {p.text}
          </text>
        </motion.g>
      ))}
    </motion.svg>
  );
}
