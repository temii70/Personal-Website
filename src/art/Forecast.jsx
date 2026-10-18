import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { rng } from "./random";
import { Anchor } from "./SignalLine";
import { palette } from "../theme";

// Experience as a time series: the signal line becomes a (very unscientific) career curve,
// each job a point on it, then a forecast with a widening uncertainty band for what's next.

const W = 1000;
const H = 340;
const X0 = 40;
const X1 = 960;
const YTOP = 56;
const YBOT = 280;
const START = 2024;
const NOW = 33; // Oct 2026, in months since Jan 2024
const END = 43; // Aug 2027

const monthIndex = (ym) => (Number(ym.slice(0, 4)) - START) * 12 + Number(ym.slice(5, 7)) - 1;
const X = (i) => X0 + (i / END) * (X1 - X0);

function build(jobs) {
  const rand = rng("career");
  const starts = new Set(jobs.map((j) => monthIndex(j.start)));
  const values = [];
  let v = 0;
  for (let i = 0; i <= NOW; i++) {
    v += 0.5 + (rand() - 0.5) * 2.2 + (starts.has(i) ? 2.2 : 0);
    values.push(v);
  }
  const slope = 0.55;
  const ahead = Array.from({ length: END - NOW + 1 }, (_, k) => ({
    mid: v + slope * k,
    spread: 1.4 * Math.sqrt(k) + 0.35 * k,
  }));

  const lo = Math.min(...values) - 1;
  const hi = Math.max(...ahead.map((a) => a.mid + a.spread));
  const Y = (val) => YBOT - ((val - lo) / (hi - lo)) * (YBOT - YTOP);

  const line = values.map((val, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(val).toFixed(1)}`).join("");
  const upper = ahead.map((a, k) => `${X(NOW + k).toFixed(1)},${Y(a.mid + a.spread).toFixed(1)}`);
  const lower = ahead.map((a, k) => `${X(NOW + k).toFixed(1)},${Y(a.mid - a.spread).toFixed(1)}`).reverse();
  const median = ahead.map((a, k) => `${k ? "L" : "M"}${X(NOW + k).toFixed(1)},${Y(a.mid).toFixed(1)}`).join("");

  return {
    line,
    band: [...upper, ...lower].join(" "),
    median,
    first: { x: X(0), y: Y(values[0]) },
    last: { x: X(END), y: Y(ahead.at(-1).mid) },
    bandTop: Y(ahead.at(-1).mid + ahead.at(-1).spread),
    points: jobs.map((j) => ({ ...j, x: X(monthIndex(j.start)), y: Y(values[monthIndex(j.start)]) })),
  };
}

const pct = (v, of) => `${((v / of) * 100).toFixed(2)}%`;

export default function Forecast({ jobs, className = "" }) {
  const still = useReducedMotion();
  const c = useMemo(() => build(jobs), [jobs]);
  const draw = {
    hidden: { pathLength: 0 },
    visible: { pathLength: 1, transition: { duration: 2.2, ease: "easeInOut" } },
  };
  const after = (delay) => ({ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay } } });

  return (
    <div className={`relative ${className}`}>
      <Anchor kind="end" dir="right" x={pct(c.first.x, W)} y={pct(c.first.y, H)} />
      <Anchor kind="start" dir="right" x={pct(c.last.x, W)} y={pct(c.last.y, H)} />

      <motion.svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full overflow-visible"
        initial={still ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        role="img"
        aria-label="A career curve from 2024 to now, one point per job, then a widening forecast band for what's next."
      >
        {/* years */}
        <g className="fill-ink-soft font-mono" fontSize="14">
          {[2024, 2025, 2026, 2027].map((year) => (
            <g key={year}>
              <line x1={X((year - START) * 12)} x2={X((year - START) * 12)} y1={YBOT + 10} y2={YBOT + 18} stroke={palette.inkSoft} />
              <text x={X((year - START) * 12)} y={YBOT + 40} textAnchor="middle">
                {year}
              </text>
            </g>
          ))}
        </g>

        {/* now */}
        <line x1={X(NOW)} x2={X(NOW)} y1={YTOP - 30} y2={YBOT + 10} stroke={palette.inkSoft} strokeDasharray="2 5" />
        <text x={X(NOW) + 8} y={YTOP - 18} className="fill-ink-soft font-mono" fontSize="14">
          now
        </text>

        {/* the forecast */}
        <motion.g variants={after(1.9)}>
          <polygon points={c.band} fill={palette.yellow} fillOpacity="0.3" />
          <path d={c.median} fill="none" stroke={palette.pink} strokeWidth="1.6" strokeDasharray="5 6" />
          <text x={X1} y={c.bandTop - 26} textAnchor="end" className="fill-ink font-mono" fontSize="15">
            next: ?
          </text>
          <text x={X1} y={c.bandTop - 8} textAnchor="end" className="fill-ink-soft font-mono" fontSize="12">
            (wide band, open to offers)
          </text>
        </motion.g>

        {/* the line itself, riso misprint underneath */}
        <motion.path d={c.line} transform="translate(2 2)" fill="none" stroke={palette.misprint} strokeOpacity="0.55" strokeWidth="1.6" strokeLinejoin="round" variants={draw} />
        <motion.path d={c.line} fill="none" stroke={palette.blue} strokeWidth="1.6" strokeLinejoin="round" variants={draw} />

        {/* jobs */}
        {c.points.map((p, i) => (
          <motion.g key={p.short} variants={after(0.6 + i * 0.25)}>
            <circle cx={p.x} cy={p.y} r="6.5" fill={palette.paper} stroke={palette.blue} strokeWidth="2" />
            <circle cx={p.x + 1.5} cy={p.y + 1.5} r="2.5" fill={palette.pink} />
            <text x={p.x} y={p.y - 18} textAnchor="middle" className="fill-ink font-mono" fontSize="14">
              {p.short}
            </text>
          </motion.g>
        ))}
      </motion.svg>
    </div>
  );
}
