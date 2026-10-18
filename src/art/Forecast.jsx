import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { rng } from "./random";
import { Anchor } from "./SignalLine";
import { palette } from "../theme";

// Experience as a time series: the signal line becomes a (very unscientific) career curve,
// each job a point on it, then a forecast with a widening uncertainty band for what's next.
// Wide screens read it left to right; phones turn it on its side so time runs down the page,
// the same way the signal line does.

const START = 2024;
const NOW = 33; // Oct 2026, in months since Jan 2024
const END = 43; // Aug 2027
const YEARS = [2024, 2025, 2026, 2027];

const monthIndex = (ym) => (Number(ym.slice(0, 4)) - START) * 12 + Number(ym.slice(5, 7)) - 1;

// The curve itself, in plain numbers: one value per month up to now, then a forecast.
function career(jobs) {
  const rand = rng("career");
  const starts = new Set(jobs.map((j) => monthIndex(j.start)));
  const values = [];
  let v = 0;
  for (let i = 0; i <= NOW; i++) {
    v += 0.5 + (rand() - 0.5) * 2.2 + (starts.has(i) ? 2.2 : 0);
    values.push(v);
  }
  const ahead = Array.from({ length: END - NOW + 1 }, (_, k) => ({ mid: v + 0.55 * k, spread: 1.4 * Math.sqrt(k) + 0.35 * k }));
  const lo = Math.min(...values) - 1;
  const hi = Math.max(...ahead.map((a) => a.mid + a.spread));
  return { values, ahead, norm: (val) => (val - lo) / (hi - lo) };
}

// Lay the curve out with `at(month, value) → [x, y]`.
function shapes(jobs, at) {
  const { values, ahead, norm } = career(jobs);
  const pt = (i, val) => at(i, norm(val)).map((n) => n.toFixed(1)).join(",");
  const upper = ahead.map((a, k) => pt(NOW + k, a.mid + a.spread));
  const lower = ahead.map((a, k) => pt(NOW + k, a.mid - a.spread)).reverse();
  const [lx, ly] = at(END, norm(ahead.at(-1).mid));
  const [fx, fy] = at(0, norm(values[0]));
  return {
    line: values.map((val, i) => `${i ? "L" : "M"}${pt(i, val)}`).join(""),
    median: ahead.map((a, k) => `${k ? "L" : "M"}${pt(NOW + k, a.mid)}`).join(""),
    band: [...upper, ...lower].join(" "),
    bandEdge: at(END, norm(ahead.at(-1).mid + ahead.at(-1).spread)),
    first: { x: fx, y: fy },
    last: { x: lx, y: ly },
    points: jobs.map((j) => {
      const [x, y] = at(monthIndex(j.start), norm(values[monthIndex(j.start)]));
      return { ...j, x, y };
    }),
  };
}

const pct = (v, of) => `${((v / of) * 100).toFixed(2)}%`;
const draw = { hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 2.2, ease: "easeInOut" } } };
const after = (delay) => ({ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay } } });

function Chart({ w, h, c, dir, still, children }) {
  return (
    <div className="relative">
      <Anchor kind="end" dir={dir} x={pct(c.first.x, w)} y={pct(c.first.y, h)} />
      <Anchor kind="start" dir={dir} x={pct(c.last.x, w)} y={pct(c.last.y, h)} />
      <motion.svg
        viewBox={`0 0 ${w} ${h}`}
        className="block h-auto w-full overflow-visible"
        initial={still ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        role="img"
        aria-label="A career curve from 2024 to now, one point per job, then a widening forecast band for what's next."
      >
        {children}
      </motion.svg>
    </div>
  );
}

function Curve({ c, width }) {
  return (
    <>
      <motion.g variants={after(1.9)}>
        <polygon points={c.band} fill={palette.yellow} fillOpacity="0.3" />
        <path d={c.median} fill="none" stroke={palette.pink} strokeWidth={width} strokeDasharray={`${width * 3} ${width * 4}`} />
      </motion.g>
      <motion.path d={c.line} fill="none" stroke={palette.blue} strokeWidth={width} strokeLinejoin="round" variants={draw} />
    </>
  );
}

function Job({ p, i, r, label }) {
  return (
    <motion.g variants={after(0.6 + i * 0.25)}>
      <circle cx={p.x} cy={p.y} r={r} fill={palette.paper} stroke={palette.blue} strokeWidth={r * 0.3} />
      <circle cx={p.x} cy={p.y} r={r * 0.38} fill={palette.pink} />
      {label}
    </motion.g>
  );
}

// Left to right, for wide screens.
function WideForecast({ jobs, still }) {
  const [W, H, X0, X1, YTOP, YBOT] = [1000, 340, 40, 960, 56, 280];
  const X = (i) => X0 + (i / END) * (X1 - X0);
  const c = useMemo(() => shapes(jobs, (i, n) => [X(i), YBOT - n * (YBOT - YTOP)]), [jobs]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Chart w={W} h={H} c={c} dir="right" still={still}>
      <g className="fill-ink-soft font-mono" fontSize="14">
        {YEARS.map((year) => (
          <g key={year}>
            <line x1={X((year - START) * 12)} x2={X((year - START) * 12)} y1={YBOT + 10} y2={YBOT + 18} stroke={palette.inkSoft} />
            <text x={X((year - START) * 12)} y={YBOT + 40} textAnchor="middle">
              {year}
            </text>
          </g>
        ))}
      </g>
      <line x1={X(NOW)} x2={X(NOW)} y1={YTOP - 30} y2={YBOT + 10} stroke={palette.inkSoft} strokeDasharray="2 5" />
      <text x={X(NOW) + 8} y={YTOP - 18} className="fill-ink-soft font-mono" fontSize="14">
        now
      </text>
      <Curve c={c} width={1.6} />
      <motion.g variants={after(1.9)} className="font-mono">
        <text x={X1} y={c.bandEdge[1] - 26} textAnchor="end" className="fill-ink" fontSize="15">
          next: ?
        </text>
        <text x={X1} y={c.bandEdge[1] - 8} textAnchor="end" className="fill-ink-soft" fontSize="12">
          (wide band, open to offers)
        </text>
      </motion.g>
      {c.points.map((p, i) => (
        <Job
          key={p.short}
          p={p}
          i={i}
          r={6.5}
          label={
            <text x={p.x} y={p.y - 18} textAnchor="middle" className="fill-ink font-mono" fontSize="14">
              {p.short}
            </text>
          }
        />
      ))}
    </Chart>
  );
}

// Top to bottom, for phones: years down the left, the curve drifting right as it grows,
// the forecast band opening out at the bottom.
function TallForecast({ jobs, still }) {
  const [W, H, XL, XR, T0, T1] = [400, 1110, 70, 330, 40, 980];
  const Y = (i) => T0 + (i / END) * (T1 - T0);
  const c = useMemo(() => shapes(jobs, (i, n) => [XL + n * (XR - XL), Y(i)]), [jobs]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Chart w={W} h={H} c={c} dir="down" still={still}>
      <g className="fill-ink-soft font-mono" fontSize="17">
        {YEARS.map((year) => (
          <g key={year}>
            <line x1="0" x2="14" y1={Y((year - START) * 12)} y2={Y((year - START) * 12)} stroke={palette.inkSoft} />
            <text x="0" y={Y((year - START) * 12) - 8}>
              {year}
            </text>
          </g>
        ))}
      </g>
      <line x1="0" x2={W} y1={Y(NOW)} y2={Y(NOW)} stroke={palette.inkSoft} strokeDasharray="2 6" />
      <text x={W} y={Y(NOW) - 8} textAnchor="end" className="fill-ink-soft font-mono" fontSize="17">
        now
      </text>
      <Curve c={c} width={2.4} />
      <motion.g variants={after(1.9)} className="font-mono">
        <text x="0" y={T1 + 64} className="fill-ink" fontSize="21">
          next: ?
        </text>
        <text x="0" y={T1 + 92} className="fill-ink-soft" fontSize="15">
          (wide band, open to offers)
        </text>
      </motion.g>
      {c.points.map((p, i) => {
        // label on whichever side has more room
        const left = p.x > W / 2;
        return (
          <Job
            key={p.short}
            p={p}
            i={i}
            r={10}
            label={
              <text x={p.x + (left ? -20 : 20)} y={p.y + 6} textAnchor={left ? "end" : "start"} className="fill-ink font-mono" fontSize="19">
                {p.short}
              </text>
            }
          />
        );
      })}
    </Chart>
  );
}

function useNarrow() {
  const query = "(max-width: 639px)";
  const [narrow, setNarrow] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return narrow;
}

export default function Forecast({ jobs, className = "" }) {
  const still = useReducedMotion();
  const narrow = useNarrow();
  return <div className={className}>{narrow ? <TallForecast jobs={jobs} still={still} /> : <WideForecast jobs={jobs} still={still} />}</div>;
}
