import { useEffect, useRef, useState } from "react";
import { rng, prefersReducedMotion } from "./random";
import { palette } from "../theme";

// The one line that runs the length of the page, travelling in the margins between chapters. Each chapter's artwork *is* the line for a
// while (a heartbeat, a forecast, a clothesline, a ball arc); chapters mark where the line
// enters and leaves their art with <Anchor>, and this component draws the stretches between,
// inking them in as you scroll. Near the top the line is pure noise; it calms as you go.

const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

// Marks a point where the line arrives at (`end`) or leaves (`start`) a chapter's art.
export function Anchor({ kind, dir = "down", x = "0%", y = "0%" }) {
  return <span aria-hidden data-signal={kind} data-dir={dir} className="pointer-events-none absolute h-0 w-0" style={{ left: x, top: y }} />;
}

function stretch(a, b, seed) {
  const rand = rng(seed);
  const [ax, ay] = DIRS[a.dir] || DIRS.down;
  const [bx, by] = DIRS[b.dir] || DIRS.down;
  const k = Math.max(90, Math.hypot(b.x - a.x, b.y - a.y) * 0.45);
  const c1 = [a.x + ax * k, a.y + ay * k];
  const c2 = [b.x - bx * k, b.y - by * k];
  const phases = [rand() * 6, rand() * 6, rand() * 6];

  const n = Math.max(12, Math.round(Math.hypot(b.x - a.x, b.y - a.y) / 5));
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    let x = u * u * u * a.x + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b.x;
    let y = u * u * u * a.y + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b.y;
    // noise: static near the top of the page, settling to a faint tremor; pinned at both ends
    const amp = (0.8 + 26 * Math.exp(-y / 450)) * Math.sin(Math.PI * Math.min(1, t * 1.15));
    x += amp * ((rand() - 0.5) * 1.7 + Math.sin(i * 0.9 + phases[0]) * 0.3);
    y += amp * 0.25 * (rand() - 0.5);
    d += `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return { d, y0: Math.min(a.y, b.y), y1: Math.max(a.y, b.y) };
}

export default function SignalLine() {
  const svgRef = useRef(null);
  const paths = useRef([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [stretches, setStretches] = useState([]);

  useEffect(() => {
    const root = svgRef.current.parentElement;
    const measure = () => {
      const box = root.getBoundingClientRect();
      const marks = [...root.querySelectorAll("[data-signal]")]
        .filter((el) => el.offsetParent) // skip anchors inside hidden (mobile/desktop-only) layouts
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { kind: el.dataset.signal, dir: el.dataset.dir, x: r.left - box.left, y: r.top - box.top };
        });

      const out = [];
      let from = { x: box.width * 0.93, y: 0, dir: "down" }; // the line starts at the top edge, in the right margin
      for (const m of marks) {
        if (m.kind === "end" && from) {
          out.push(stretch(from, m, `stretch-${out.length}`));
          from = null;
        } else if (m.kind === "start") {
          from = m;
        }
      }
      setStretches(out);
      setSize({ w: root.offsetWidth, h: root.offsetHeight });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const still = prefersReducedMotion();
    const onScroll = () => {
      const pen = window.scrollY + window.innerHeight * 0.7;
      stretches.forEach((s, i) => {
        const f = still ? 1 : Math.min(1, Math.max(0, (pen - s.y0) / Math.max(1, s.y1 - s.y0)));
        for (const p of paths.current[i] || []) if (p) p.style.strokeDashoffset = String(1 - f);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [stretches]);

  return (
    <svg ref={svgRef} aria-hidden className="pointer-events-none absolute left-0 top-0 z-[5]" width={size.w} height={size.h}>
      {stretches.map((s, i) => (
        <g key={i} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* riso misprint: a pink pass slightly off-register under the blue */}
          <path
            ref={(el) => ((paths.current[i] ||= [])[0] = el)}
            d={s.d}
            transform="translate(1.6 1.4)"
            stroke={palette.pink}
            strokeOpacity="0.55"
            strokeWidth="1.6"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
          <path
            ref={(el) => ((paths.current[i] ||= [])[1] = el)}
            d={s.d}
            stroke={palette.blue}
            strokeWidth="1.6"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        </g>
      ))}
    </svg>
  );
}
